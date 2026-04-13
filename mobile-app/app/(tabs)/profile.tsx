import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getMyProfileRequest } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function ProfileScreen() {
  const { accessToken, logout, refreshAuthTokens } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      try {
        if (!accessToken) return;
        if (isMounted) setLoading(true);
        const res = await getMyProfileRequest(accessToken);
        if (isMounted) {
          setProfile(res);
          setError("");
        }
      } catch (err: any) {
        if (err.status === 401) {
          const refreshed = await refreshAuthTokens();
          if (refreshed) {
             return; // Let the effect re-run when the new accessToken prop triggers
          }
        }
        if (isMounted) setError(err.message || "Failed to load profile");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchProfile();
    return () => { isMounted = false; };
  }, [accessToken]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#085836" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>My Profile</Text>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : profile ? (
          <View style={styles.card}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.initials}>{profile.firstName?.charAt(0) || "U"}</Text>
            </View>
            <Text style={styles.name}>{`${profile.firstName} ${profile.middleName || ''} ${profile.surName}`.trim()}</Text>
            <Text style={styles.mobile}>+91 {profile.mobileNo}</Text>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Address</Text>
              <Text style={styles.detailValue}>{profile.address}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>District</Text>
              <Text style={styles.detailValue}>{profile.district}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>State & Pincode</Text>
              <Text style={styles.detailValue}>{profile.state}, {profile.pinCode}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Profile Status</Text>
              <Text style={styles.detailValue}>{profile.profileCompleted ? "Completed" : "Incomplete"}</Text>
            </View>
          </View>
        ) : null}

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7F5",
  },
  scrollContent: {
    padding: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111",
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 30,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E6EFEC",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  initials: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#085836",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  mobile: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: "#EEE",
    width: "100%",
    marginBottom: 20,
  },
  detailRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 15,
    color: "#888",
    flex: 1,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    flex: 2,
    textAlign: "right",
  },
  errorBox: {
    backgroundColor: "#FEE2E2",
    padding: 16,
    borderRadius: 8,
    width: "100%",
    marginBottom: 20,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 15,
    textAlign: "center",
  },
  logoutButton: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#FDEAEA",
    alignItems: "center",
  },
  logoutText: {
    color: "#E02B2B",
    fontSize: 16,
    fontWeight: "bold",
  },
});
