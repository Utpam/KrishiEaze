import { Feather, FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { t, i18n } = useTranslation();
  const [langModalVisible, setLangModalVisible] = useState(false);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setLangModalVisible(false);
  };

  const currentLangLabel = () => {
    if (i18n.language === 'en') return 'Eng';
    if (i18n.language === 'hi') return 'हिंदी';
    if (i18n.language === 'mr') return 'मराठी';
    return 'Eng';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>

      {/* Language Selection Modal */}
      <Modal visible={langModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Language</Text>

            <TouchableOpacity style={styles.langOption} onPress={() => changeLanguage('en')}>
              <Text style={[styles.langOptionText, i18n.language === 'en' && styles.langOptionTextActive]}>English</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.langOption} onPress={() => changeLanguage('hi')}>
              <Text style={[styles.langOptionText, i18n.language === 'hi' && styles.langOptionTextActive]}>हिंदी</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.langOption} onPress={() => changeLanguage('mr')}>
              <Text style={[styles.langOptionText, i18n.language === 'mr' && styles.langOptionTextActive]}>मराठी</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeModalButton} onPress={() => setLangModalVisible(false)}>
              <Text style={styles.closeModalText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Feather name="menu" size={26} color="#085836" />
          </TouchableOpacity>
          <Text style={styles.logoText}>{t('common.krishieaze')}</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={() => setLangModalVisible(true)} style={styles.langButton}>
              <MaterialIcons name="language" size={16} color="#085836" style={{ marginRight: 4 }} />
              <Text style={styles.langText}>{currentLangLabel()}</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <MaterialIcons name="notifications" size={26} color="#555" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://media.istockphoto.com/id/939194718/photo/old-age-indian-man-portrait-at-outdoor.jpg?s=612x612&w=0&k=20&c=874l6agIVEXT22fjC6LfdFpjf6J_AZjH-XtRRsAWIao=' }}
              style={styles.avatar}
            />
          </View>
          <View style={styles.welcomeTextContainer}>
            <Text style={styles.greetingText}>{t('home.greetingUser')}</Text>
            <Text style={styles.nameText}>Rajesh Kumar</Text>
          </View>
        </View>
        <Text style={styles.statusText}>
          {t('home.farmStatus')}
        </Text>

        {/* Earnings Card */}
        <View style={styles.earningsCard}>
          <Text style={styles.earningsTitle}>{t('home.totalEarnings')}</Text>
          <View style={styles.earningsRow}>
            <Text style={styles.earningsAmount}>₹42,850</Text>
            <Text style={styles.earningsSubtitle}>{t('home.thisMonth')}</Text>
          </View>
          <MaterialCommunityIcons
            name="cash"
            size={120}
            color="rgba(255,255,255,0.08)"
            style={styles.earningsBgIcon}
          />
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <FontAwesome5 name="truck" size={24} color="#D95A11" style={styles.statIcon} />
            <Text style={styles.statNumber}>08</Text>
            <Text style={styles.statLabel}>{t('home.activeOrders')}</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="cube" size={24} color="#085836" style={styles.statIcon} />
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>{t('home.activeListings')}</Text>
          </View>
        </View>

        {/* Latest Mandi Prices */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('home.latestMandiPrices')}</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>{t('home.viewAll')}</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.mandiScroll}
        >
          <View style={styles.mandiCard}>
            <View style={styles.mandiCardHeader}>
              <Text style={styles.mandiItemName}>{t('home.wheat')}</Text>
              <Feather name="trending-up" size={16} color="#D95A11" />
            </View>
            <Text style={styles.mandiPrice}>₹2,150</Text>
            <Text style={styles.mandiUnit}>{t('home.perQuintal')}</Text>
          </View>
          <View style={styles.mandiCard}>
            <View style={styles.mandiCardHeader}>
              <Text style={styles.mandiItemName}>{t('home.riceBasmati')}</Text>
              <Feather name="trending-up" size={16} color="#D95A11" />
            </View>
            <Text style={styles.mandiPrice}>₹4,200</Text>
            <Text style={styles.mandiUnit}>{t('home.perQuintal')}</Text>
          </View>
          <View style={styles.mandiCard}>
            <View style={styles.mandiCardHeader}>
              <Text style={styles.mandiItemName}>{t('home.maize')}</Text>
              <Feather name="trending-up" size={16} color="#D95A11" />
            </View>
            <Text style={styles.mandiPrice}>₹1,850</Text>
            <Text style={styles.mandiUnit}>{t('home.perQuintal')}</Text>
          </View>
        </ScrollView>

        {/* Recent Transactions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('home.recentTransactions')}</Text>
        </View>
        <View style={styles.transactionsContainer}>

          <View style={styles.transactionItem}>
            <View style={[styles.txIconContainer, { backgroundColor: '#E8F5E9' }]}>
              <FontAwesome5 name="shopping-cart" size={16} color="#085836" />
            </View>
            <View style={styles.txDetails}>
              <Text style={styles.txTitle}>{t('home.bulkWheatSale')}</Text>
              <Text style={styles.txDate}>Oct 24 • ID: #KR8291</Text>
            </View>
            <View style={styles.txRight}>
              <Text style={styles.txAmountPositive}>+₹18,200</Text>
              <View style={[styles.txBadge, { backgroundColor: '#D4EDDA' }]}>
                <Text style={[styles.txBadgeText, { color: '#155724' }]}>{t('home.status.completed')}</Text>
              </View>
            </View>
          </View>

          <View style={styles.transactionItem}>
            <View style={[styles.txIconContainer, { backgroundColor: '#FFF0E6' }]}>
              <FontAwesome5 name="tractor" size={16} color="#8B4513" />
            </View>
            <View style={styles.txDetails}>
              <Text style={styles.txTitle}>{t('home.fertilizerPurchase')}</Text>
              <Text style={styles.txDate}>Oct 22 • ID: #KR8254</Text>
            </View>
            <View style={styles.txRight}>
              <Text style={styles.txAmountNegative}>-₹2,450</Text>
              <View style={[styles.txBadge, { backgroundColor: '#E2E3E5' }]}>
                <Text style={[styles.txBadgeText, { color: '#383D41' }]}>{t('home.status.processed')}</Text>
              </View>
            </View>
          </View>

          <View style={styles.transactionItem}>
            <View style={[styles.txIconContainer, { backgroundColor: '#E8F5E9' }]}>
              <FontAwesome5 name="truck" size={16} color="#085836" />
            </View>
            <View style={styles.txDetails}>
              <Text style={styles.txTitle}>{t('home.organicCornSale')}</Text>
              <Text style={styles.txDate}>Oct 20 • ID: #KR8190</Text>
            </View>
            <View style={styles.txRight}>
              <Text style={styles.txAmountPositive}>+₹12,500</Text>
              <View style={[styles.txBadge, { backgroundColor: '#D4EDDA' }]}>
                <Text style={[styles.txBadgeText, { color: '#155724' }]}>{t('home.status.completed')}</Text>
              </View>
            </View>
          </View>

        </View>

        {/* Extra padding to prevent the FAB/Tabs from covering content */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  langButton: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  langText: {
    color: '#085836',
    fontWeight: 'bold',
    fontSize: 13,
  },
  logoText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#085836',
  },
  welcomeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  welcomeTextContainer: {
    marginLeft: 15,
  },
  greetingText: {
    fontSize: 14,
    color: '#555',
  },
  nameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111',
  },
  statusText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    marginBottom: 20,
  },
  earningsCard: {
    backgroundColor: '#197A43',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  earningsTitle: {
    color: '#E8F5E9',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  earningsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  earningsAmount: {
    color: '#FFF',
    fontSize: 34,
    fontWeight: 'bold',
  },
  earningsSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginLeft: 10,
    marginBottom: 6,
  },
  earningsBgIcon: {
    position: 'absolute',
    right: -20,
    top: -20,
    transform: [{ rotate: '15deg' }],
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  statIcon: {
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#085836',
  },
  mandiScroll: {
    paddingRight: 20,
    paddingBottom: 10,
    marginBottom: 20,
  },
  mandiCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginRight: 15,
    width: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  mandiCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  mandiItemName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  mandiPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 4,
  },
  mandiUnit: {
    fontSize: 10,
    color: '#777',
    fontWeight: '600',
  },
  transactionsContainer: {
    marginBottom: 10,
  },
  transactionItem: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  txIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  txDetails: {
    flex: 1,
  },
  txTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
    marginBottom: 4,
  },
  txDate: {
    fontSize: 12,
    color: '#777',
  },
  txRight: {
    alignItems: 'flex-end',
  },
  txAmountPositive: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 6,
  },
  txAmountNegative: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 6,
  },
  txBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  txBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 280,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 20,
  },
  langOption: {
    width: '100%',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  langOptionText: {
    fontSize: 16,
    color: '#555',
  },
  langOptionTextActive: {
    color: '#085836',
    fontWeight: 'bold',
  },
  closeModalButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
  },
  closeModalText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '600',
  },
});
