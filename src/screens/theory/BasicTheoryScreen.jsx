import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { spacing } from '../../theme';
import Icon from '../../components/common/Icon';
import API_CONFIG from '../../config/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const API_BASE = API_CONFIG.BASE_URL;

const TABS = ['Basic Theory', 'History', 'Dynasties'];

const DynastiesContent = ({ dynasties, loading }) => (
  <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
    <Text style={styles.pageTitle}>DYNASTIES</Text>
    {loading ? (
      <ActivityIndicator color="#006CB5" style={{ marginTop: 40 }} />
    ) : (
      dynasties.map((item, index) => (
        <View key={item._id || index} style={styles.dynastyRow}>
          <Text style={styles.dynastyPeriod}>{item.period}</Text>
          <Text style={styles.dynastyName}>{item.name}</Text>
        </View>
      ))
    )}
    <View style={styles.bottomSpace} />
  </ScrollView>
);

const HistoryContent = ({ sections, loading }) => (
  <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
    <Text style={styles.pageTitle}>HISTORY</Text>
    {loading ? (
      <ActivityIndicator color="#006CB5" style={{ marginTop: 40 }} />
    ) : sections.length === 0 ? (
      <Text style={styles.sectionBody}>No history content yet.</Text>
    ) : (
      sections.map((item, index) => (
        <View key={item._id || index} style={styles.historyRow}>
          <Text style={styles.historyPeriod}>{item.period}</Text>
          <Text style={styles.historyDesc}>{item.description}</Text>
        </View>
      ))
    )}
    <View style={styles.bottomSpace} />
  </ScrollView>
);

const BasicTheoryScreen = ({ onBack }) => {
  const [showFounderDetail, setShowFounderDetail] = useState(false);
  const [selectedTenet, setSelectedTenet] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const scrollRef = useRef(null);

  // API data
  const [dynasties, setDynasties] = useState([]);
  const [historySections, setHistorySections] = useState([]);
  const [founderData, setFounderData] = useState(null);
  const [dobokData, setDobokData] = useState(null);
  const [basicContent, setBasicContent] = useState({ whatIsTkd: null, etymology: null, studentOath: null });
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [basicTheoryItems, setBasicTheoryItems] = useState([]);
  const [loadingDynasties, setLoadingDynasties] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/theory-syllabus/dynasties`)
      .then(r => r.json()).then(d => setDynasties(d.data || [])).catch(() => {}).finally(() => setLoadingDynasties(false));
    fetch(`${API_BASE}/theory-syllabus/history`)
      .then(r => r.json()).then(d => setHistorySections(d.data || [])).catch(() => {}).finally(() => setLoadingHistory(false));
    fetch(`${API_BASE}/theory-syllabus/basic-theory`)
      .then(r => r.json()).then(d => { setBasicTheoryItems(d.data || []); }).catch(() => {});
  }, []);

  const handleTabPress = (index) => {
    setActiveTab(index);
    scrollRef.current?.scrollTo({ x: index * SCREEN_WIDTH, animated: true });
  };

  const handleScroll = (e) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActiveTab(index);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#006CB5" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <Icon name="arrow-back" size={24} color="#fff" type="MaterialIcons" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Basic Theory</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        {TABS.map((tab, index) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabItem, activeTab === index && styles.tabItemActive]}
            onPress={() => handleTabPress(index)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === index && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Swipeable Pages */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
      >
        {/* Page 1: Basic Theory */}
        <View style={{ width: SCREEN_WIDTH, flex: 1 }}>
          <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <Text style={styles.pageTitle}>BASIC THEORY</Text>

            {/* Dynamic basic theory items from admin */}
            {basicTheoryItems.map((item) => (
              <TouchableOpacity
                key={item._id}
                activeOpacity={item.fullDetails?.length > 0 ? 0.7 : 1}
                onPress={() => item.fullDetails?.length > 0 ? setSelectedSection(item) : null}
                style={styles.btSection}
              >
                <View style={styles.btTitleRow}>
                  <View style={{ flex: 1, paddingRight: item.image ? 112 : 0 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                      <Text style={styles.btTitle}>{item.title}</Text>
                      {item.koreanName ? <Text style={styles.btKorean}> ({item.koreanName})</Text> : null}
                      {item.fullDetails?.length > 0 ? (
                        <Icon name="chevron-right" size={20} color="#006CB5" type="MaterialIcons" style={{ marginLeft: 4 }} />
                      ) : null}
                    </View>
                    {item.subtitle ? <Text style={styles.btSubtitle}>{item.subtitle}</Text> : null}
                    {item.description ? <Text style={styles.btDescription}>{item.description}</Text> : null}
                    {item.points?.length > 0 ? item.points.map((p, i) => {
                      const hasDetail = p.details?.length > 0;
                      return (
                        <TouchableOpacity
                          key={i}
                          activeOpacity={hasDetail ? 0.7 : 1}
                          onPress={() => hasDetail ? setSelectedPoint(p) : null}
                          style={styles.btPointRow}
                        >
                          <Text style={styles.btPoint}>• {p.text}</Text>
                          {hasDetail ? <Icon name="chevron-right" size={16} color="#006CB5" type="MaterialIcons" /> : null}
                        </TouchableOpacity>
                      );
                    }) : null}
                  </View>
                  {item.image ? (
                    <Image
                      source={{ uri: `${API_BASE.replace('/api', '')}${item.image}` }}
                      style={styles.btCornerImage}
                      resizeMode="cover"
                    />
                  ) : null}
                </View>
              </TouchableOpacity>
            ))}

            <View style={styles.bottomSpace} />
          </ScrollView>
        </View>

        {/* Page 2: History */}
        <View style={{ width: SCREEN_WIDTH, flex: 1 }}>
          <HistoryContent sections={historySections} loading={loadingHistory} />
        </View>

        {/* Page 3: Dynasties */}
        <View style={{ width: SCREEN_WIDTH, flex: 1 }}>
          <DynastiesContent dynasties={dynasties} loading={loadingDynasties} />
        </View>
      </ScrollView>

      {/* Tenet Bottom Sheet */}
      <Modal
        visible={!!selectedTenet}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedTenet(null)}
      >
        <View style={styles.sheetOverlay}>
          <TouchableOpacity style={styles.sheetBackdrop} activeOpacity={1} onPress={() => setSelectedTenet(null)} />
          <View style={styles.sheetContent}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <View style={styles.sheetTitleBlock}>
                <Text style={styles.sheetName}>{selectedTenet?.name}</Text>
                <Text style={styles.sheetKorean}>({selectedTenet?.korean})</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedTenet(null)} activeOpacity={0.7}>
                <Icon name="close" size={24} color="#fff" type="MaterialIcons" />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sheetBody}>
              <Text style={styles.sheetIntro}>{selectedTenet?.intro}</Text>
              {selectedTenet?.points.map((point, index) => (
                <View key={index} style={styles.sheetPointRow}>
                  <Text style={styles.sheetPointNumber}>{index + 1}.</Text>
                  <Text style={styles.sheetPointText}>{point}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Founder Detail Modal */}
      <Modal
        visible={showFounderDetail}
        animationType="slide"
        onRequestClose={() => setShowFounderDetail(false)}
      >
        <SafeAreaView style={styles.modalSafe}><StatusBar barStyle="light-content" backgroundColor="#006CB5" />
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowFounderDetail(false)} activeOpacity={0.7}>
              <Icon name="arrow-back" size={24} color="#fff" type="MaterialIcons" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>General Choi Hong Hi</Text>
            <View style={{ width: 24 }} />
          </View>
          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            {founderData?.founderImage && (
              <Image
                source={{ uri: `${API_BASE.replace('/api', '')}${founderData.founderImage}` }}
                style={styles.modalImage}
                resizeMode="cover"
              />
            )}
            <Text style={styles.modalName}>
              {founderData?.founderName}{'\n'}{founderData?.founderDegree}
            </Text>
            {founderData?.founderDates ? (
              <Text style={styles.modalDate}>{founderData.founderDates}</Text>
            ) : null}
            {founderData?.founderSections?.map((s, i) => (
              <View key={i}>
                <Text style={styles.modalSectionTitle}>{s.title}</Text>
                <Text style={styles.modalText}>{s.text}</Text>
              </View>
            ))}
            <View style={styles.bottomSpace} />
          </ScrollView>
        </SafeAreaView>
      </Modal>
      {/* Full Detail Modal */}
      <Modal
        visible={!!selectedSection}
        animationType="slide"
        onRequestClose={() => setSelectedSection(null)}
      >
        <SafeAreaView style={styles.modalSafe}><StatusBar barStyle="light-content" backgroundColor="#006CB5" />
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setSelectedSection(null)} activeOpacity={0.7}>
              <Icon name="arrow-back" size={24} color="#fff" type="MaterialIcons" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{selectedSection?.title}</Text>
            <View style={{ width: 24 }} />
          </View>
          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            {selectedSection?.image && (
              <Image source={{ uri: `${API_BASE.replace('/api', '')}${selectedSection.image}` }} style={styles.modalImage} resizeMode="cover" />
            )}
            {(selectedSection?.fullDetails || []).map((section, si) => (
              <View key={si} style={{ marginTop: si === 0 ? spacing.md : spacing.xl }}>
                {section.image ? (
                  <Image source={{ uri: `${API_BASE.replace('/api', '')}${section.image}` }} style={styles.modalImage} resizeMode="cover" />
                ) : null}
                {section.title ? <Text style={styles.modalSectionTitle}>{section.title}</Text> : null}
                {section.subtitle ? <Text style={styles.modalSubtitle}>{section.subtitle}</Text> : null}
                {(section.paragraphs || []).map((p, pi) => (
                  <Text key={pi} style={[styles.modalText, { marginTop: pi > 0 ? spacing.md : 4 }]}>{p}</Text>
                ))}
                {(section.points || []).map((p, pi) => (
                  <View key={pi} style={styles.sheetPointRow}>
                    <Text style={styles.sheetPointNumber}>{pi + 1}.</Text>
                    <Text style={styles.sheetPointText}>{p}</Text>
                  </View>
                ))}
              </View>
            ))}
            <View style={styles.bottomSpace} />
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Point Detail Modal */}
      <Modal
        visible={!!selectedPoint}
        animationType="slide"
        onRequestClose={() => setSelectedPoint(null)}
      >
        <SafeAreaView style={styles.modalSafe}><StatusBar barStyle="light-content" backgroundColor="#006CB5" />
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setSelectedPoint(null)} activeOpacity={0.7}>
              <Icon name="arrow-back" size={24} color="#fff" type="MaterialIcons" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{selectedPoint?.text}</Text>
            <View style={{ width: 24 }} />
          </View>
          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            {(selectedPoint?.details || []).map((section, si) => (
              <View key={si} style={{ marginTop: si === 0 ? spacing.md : spacing.xl }}>
                {section.image ? (
                  <Image source={{ uri: `${API_BASE.replace('/api', '')}${section.image}` }} style={styles.modalImage} resizeMode="cover" />
                ) : null}
                {section.title ? <Text style={styles.modalSectionTitle}>{section.title}</Text> : null}
                {section.subtitle ? <Text style={styles.modalSubtitle}>{section.subtitle}</Text> : null}
                {section.description ? <Text style={[styles.modalText, { marginTop: 4 }]}>{section.description}</Text> : null}
                {(section.points || []).map((p, pi) => (
                  <View key={pi} style={styles.sheetPointRow}>
                    <Text style={styles.sheetPointNumber}>{pi + 1}.</Text>
                    <Text style={styles.sheetPointText}>{p}</Text>
                  </View>
                ))}
              </View>
            ))}
            <View style={styles.bottomSpace} />
          </ScrollView>
        </SafeAreaView>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: '#006CB5',
    borderBottomWidth: 1,
    borderBottomColor: '#0057a0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Tab bar
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: '#006CB5',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#9ca3af',
  },
  tabTextActive: {
    color: '#006CB5',
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1f2937',
    textAlign: 'center',
    marginVertical: spacing.xl,
    letterSpacing: 1,
  },
  btSection: {
    marginBottom: spacing.lg,
    paddingBottom: spacing.lg,
  },
  btTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  btTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  btKorean: {
    fontSize: 14,
    color: '#6b7280',
  },
  btCornerImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: '#e5e7eb',
  },
  btImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: spacing.sm,
    backgroundColor: '#e5e7eb',
  },
  btDescription: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
    marginTop: 4,
    marginBottom: spacing.sm,
  },
  btSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
    marginBottom: 4,
  },
  btPointRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  btPoint: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
    flex: 1,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: spacing.md,
  },
  sectionBody: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 26,
    marginBottom: spacing.md,
  },
  tenetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  tenet: { fontSize: 17, color: '#374151', fontWeight: '600', flex: 1 },
  tenetKorean: { fontSize: 13, color: '#6b7280', marginRight: spacing.sm },
  founderCard: {
    flexDirection: 'row',
    marginBottom: spacing.xl,
    alignItems: 'flex-start',
  },
  founderLeft: { flex: 1, marginRight: spacing.md },
  founderName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1f2937',
    lineHeight: 30,
    marginBottom: spacing.md,
  },
  readMoreButton: {
    borderWidth: 2,
    borderColor: '#006CB5',
    borderRadius: 12,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignSelf: 'flex-start',
  },
  readMoreText: {
    color: '#006CB5',
    fontWeight: '800',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  founderImage: {
    width: 160,
    height: 180,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
  },
  dobokSection: {
    flexDirection: 'row',
    marginBottom: spacing.xl,
    alignItems: 'flex-start',
  },
  dobokText: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    lineHeight: 26,
    marginRight: spacing.md,
  },
  dobokLogoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 90,
  },
  dobokImage: {
    width: 90,
    height: 110,
    borderRadius: 6,
  },
  dobokLogo: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1f2937',
    textAlign: 'center',
    lineHeight: 36,
  },
  dobokLogoEn: {
    fontSize: 9,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
    letterSpacing: 1,
    marginTop: 4,
  },
  powerItem: { marginBottom: spacing.lg },
  powerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  powerTermBold: { fontWeight: '800', color: '#1f2937', fontSize: 16 },
  powerTermKorean: { color: '#16a34a', fontWeight: '700', fontSize: 16 },
  powerDesc: { fontSize: 16, color: '#374151', lineHeight: 26 },
  kwanRow: {
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: '#16a34a',
  },
  kwanName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 2,
  },
  kwanDetail: {
    fontSize: 13,
    color: '#6b7280',
  },
  itfLogosRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: spacing.md,
    paddingVertical: spacing.md,
  },
  itfBadge: { width: 120, height: 120 },
  itfWordmark: { width: 160, height: 80 },
  bottomSpace: { height: 40 },
  dynastyRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  dynastyPeriod: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#006CB5',
    fontWeight: '600',
    marginBottom: 2,
  },
  dynastyName: {
    fontSize: 17,
    color: '#1f2937',
  },
  historyRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  historyPeriod: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#006CB5',
    fontWeight: '600',
    marginBottom: 4,
  },
  historyDesc: {
    fontSize: 15,
    color: '#1f2937',
    lineHeight: 24,
  },
  // Bottom sheet
  sheetOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheetBackdrop: { flex: 1 },
  sheetContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '80%',
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  sheetTitleBlock: { flex: 1 },
  sheetName: { fontSize: 22, fontWeight: '800', color: '#1f2937' },
  sheetKorean: { fontSize: 14, color: '#16a34a', fontWeight: '600', marginTop: 2 },
  sheetBody: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    paddingBottom: 40,
  },
  sheetIntro: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 26,
    marginBottom: spacing.lg,
  },
  sheetPointRow: { flexDirection: 'row', marginBottom: spacing.md },
  sheetPointNumber: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '700',
    marginRight: spacing.sm,
    minWidth: 24,
  },
  sheetPointText: { fontSize: 16, color: '#374151', lineHeight: 24, flex: 1 },
  // Founder modal
  modalSafe: { flex: 1, backgroundColor: '#fff' },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: '#006CB5',
    borderBottomWidth: 1,
    borderBottomColor: '#0057a0',
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  modalBody: { flex: 1, paddingHorizontal: spacing.md },
  modalImage: {
    width: '100%',
    height: 320,
    borderRadius: 12,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: '#e5e7eb',
  },
  modalName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1f2937',
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: spacing.sm,
  },
  modalDate: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  modalSubtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#006CB5',
    marginBottom: spacing.sm,
  },
  modalText: { fontSize: 15, color: '#374151', lineHeight: 24, marginBottom: spacing.md },
});

export default BasicTheoryScreen;
