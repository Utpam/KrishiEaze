package com.Backend.KrishiEaze.services;

import com.Backend.KrishiEaze.dto.AgmarknetApiResponseDto;
import com.Backend.KrishiEaze.dto.MandiRequestDto;
import com.Backend.KrishiEaze.dto.MandiResponseDto;
import com.Backend.KrishiEaze.entities.Mandi;
import com.Backend.KrishiEaze.repositories.MandiRepository;
import com.Backend.KrishiEaze.repositories.SellRequestRepository;
//import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MandiService {

    private final MandiRepository mandiRepository;
    private final SellRequestRepository sellRequestRepository;

    @Value("${gov.api.key}")
    private String API_KEY;
    @Value("${gov.base.url}")
    private String BASE_URL;

    public double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return 6371 * c;
    }

    public List<MandiResponseDto> getNearbyMandis(MandiRequestDto request) {
        String searchCrop = (request.getCrop() != null) ? request.getCrop().trim() : "";

        // ✅ STEP 1: Fetch all mandis from DB once
        List<Mandi> allMandis = mandiRepository.findAll();

        // ✅ STEP 2: Get unique states from mandis within 400km
        List<String> nearbyStates = allMandis.stream()
                .filter(m -> calculateDistance(
                        request.getLat(), request.getLng(),
                        m.getLat(), m.getLng()) < 400)
                .map(Mandi::getState)
                .distinct()
                .toList();

        //System.out.println(">>> Nearby states: " + nearbyStates);

        // ✅ STEP 3: Fetch paginated API records per state and merge
        List<AgmarknetApiResponseDto.AgmarknetRecord> allRecords = new ArrayList<>();
        ObjectMapper mapper = new ObjectMapper();

        for (String state : nearbyStates) {
            int offset = 0;
            int pageSize = 10;
            int fetched;
            int maxRecords = 500; // safety cap

            do {
                try {
                    String encodedCrop = URLEncoder.encode(searchCrop, StandardCharsets.UTF_8);
                    String encodedState = URLEncoder.encode(state, StandardCharsets.UTF_8);

                    String rawUrl = BASE_URL
                            + "?api-key=" + API_KEY
                            + "&format=json"
                            + "&limit=" + pageSize
                            + "&offset=" + offset
                            + "&filters%5Bcommodity%5D=" + encodedCrop
                            + "&filters%5Bstate%5D=" + encodedState;

                    java.net.HttpURLConnection conn = (java.net.HttpURLConnection)
                            new java.net.URL(rawUrl).openConnection();
                    conn.setRequestMethod("GET");
                    conn.setRequestProperty("Accept", "application/json");
                    conn.setRequestProperty("user-agent", "Mozilla/5.0");

                    java.util.Scanner scanner = new java.util.Scanner(conn.getInputStream());
                    StringBuilder rawResponse = new StringBuilder();
                    while (scanner.hasNextLine()) rawResponse.append(scanner.nextLine());
                    scanner.close();

                    AgmarknetApiResponseDto dto = mapper.readValue(
                            rawResponse.toString(), AgmarknetApiResponseDto.class);

                    if (dto.getRecords() != null && !dto.getRecords().isEmpty()) {
                        allRecords.addAll(dto.getRecords());
                        fetched = dto.getRecords().size();
//                        System.out.println(">>> " + state + " offset=" + offset
//                                + ": fetched " + fetched
//                                + " records (total so far: " + allRecords.size() + ")");
                        offset += pageSize;
                    } else {
                        fetched = 0;
                    }

                } catch (Exception e) {
                    System.err.println(">>> API Error for state " + state + ": " + e.getMessage());
                    break;
                }

            } while (fetched == pageSize && allRecords.size() < maxRecords);
        }

        //System.out.println(">>> TOTAL records fetched: " + allRecords.size());

        // ✅ STEP 4: Map each mandi to response DTO with matched price
        final List<AgmarknetApiResponseDto.AgmarknetRecord> finalRecords = allRecords;
        final String finalSearchCrop = searchCrop.toLowerCase();

        return allMandis.stream()
                .map(mandi -> {
                    double dist = calculateDistance(
                            request.getLat(), request.getLng(),
                            mandi.getLat(), mandi.getLng());

                    String livePrice = "Price N/A";
                    String commodityName = "N/A";

                    if (!finalRecords.isEmpty() && !finalSearchCrop.isEmpty()) {
                        Optional<AgmarknetApiResponseDto.AgmarknetRecord> matchingRecord = finalRecords.stream()
                                .filter(record -> {
                                    if (record.getMarket() == null || record.getCommodity() == null) {
                                        return false;
                                    }

                                    // Clean API market name
                                    String apiMarket = record.getMarket()
                                            .toLowerCase()
                                            .replaceAll("\\s+", " ")
                                            .trim();

                                    // Clean DB mandi name (remove APMC, brackets, extra spaces)
                                    String dbMandi = mandi.getMandiName()
                                            .toLowerCase()
                                            .replace("apmc", "")
                                            .replaceAll("\\(.*?\\)", "")
                                            .replaceAll("\\s+", " ")
                                            .trim();

                                    boolean marketMatch = apiMarket.contains(dbMandi)
                                            || dbMandi.contains(apiMarket);
                                    boolean commodityMatch = record.getCommodity()
                                            .toLowerCase()
                                            .contains(finalSearchCrop);

                                    return marketMatch && commodityMatch;
                                })
                                .findFirst();

                        if (matchingRecord.isPresent()) {
                            livePrice = "₹" + matchingRecord.get().getModal_price().intValue();
                            commodityName = matchingRecord.get().getCommodity();
//                            System.out.println(">>> MATCH FOUND: " + mandi.getMandiName()
//                                    + " -> Price: " + livePrice);
                        }
                    }

                    return MandiResponseDto.builder()
                            .mandiId(mandi.getId())
                            .mandiName(mandi.getMandiName())
                            .state(mandi.getState())
                            .district(mandi.getDistrict())
                            .commodity(commodityName)
                            .modalPrice(livePrice)
                            .priceUnit(livePrice.equals("Price N/A") ? null : "₹/quintal")
                            .distanceKm(Math.round(dist * 100.0) / 100.0)
                            .lat(mandi.getLat())
                            .lng(mandi.getLng())
                            .build();
                })
                .sorted(Comparator.comparingDouble(MandiResponseDto::getDistanceKm))
                .collect(Collectors.toList());
    }
    // ✅ Add this method to MandiService.java
    public Double getLivePriceForMandi(String mandiName, String crop, String state) {
        try {
            String encodedCrop = URLEncoder.encode(crop, StandardCharsets.UTF_8);
            String encodedState = URLEncoder.encode(state, StandardCharsets.UTF_8);

            // Fetch small batch of recent records for that state/crop
            String rawUrl = BASE_URL
                    + "?api-key=" + API_KEY
                    + "&format=json"
                    + "&limit=50"
                    + "&filters%5Bcommodity%5D=" + encodedCrop
                    + "&filters%5Bstate%5D=" + encodedState;

            java.net.HttpURLConnection conn = (java.net.HttpURLConnection) new java.net.URL(rawUrl).openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("user-agent", "Mozilla/5.0");

            java.util.Scanner scanner = new java.util.Scanner(conn.getInputStream());
            StringBuilder rawResponse = new StringBuilder();
            while (scanner.hasNextLine()) rawResponse.append(scanner.nextLine());
            scanner.close();

            ObjectMapper mapper = new ObjectMapper();
            AgmarknetApiResponseDto dto = mapper.readValue(rawResponse.toString(), AgmarknetApiResponseDto.class);

            if (dto.getRecords() == null) return null;

            // Clean DB mandi name once
            String cleanDbMandi = mandiName.toLowerCase().replace("apmc", "").replaceAll("\\(.*?\\)", "").trim();

            return dto.getRecords().stream()
                    .filter(record -> {
                        String apiMarket = record.getMarket().toLowerCase().trim();
                        return apiMarket.contains(cleanDbMandi) || cleanDbMandi.contains(apiMarket);
                    })
                    .findFirst()
                    .map(record -> record.getModal_price())
                    .orElse(null);

        } catch (Exception e) {
            System.err.println(">>> Error fetching specific price: " + e.getMessage());
            return null;
        }
    }
}