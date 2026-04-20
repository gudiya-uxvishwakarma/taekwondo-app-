import React, { useState, useEffect } from 'react';
import {
  View, Text, SafeAreaView, StatusBar, TouchableOpacity,
  ScrollView, StyleSheet, Image, ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import API_CONFIG from '../../config/api';

// sparringData prop = pre-fetched object from SparringListScreen (optional)
// sparring prop = type string e.g. '3-step'
const SparringScreen = ({ sparring, sparringData, onBack }) => {
  const [data, setData] = useState(sparringData || null);
  const [loading, setLoading] = useState(!sparringData);
  const [expandedRoutine, setExpandedRoutine] = useState(null);

  useEffect(() => {
    if (!sparringData) fetchSparring();
  }, [sparring]);

  const fetchSparring = async () => {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/sparring/${encodeURIComponent(sparring)}`);
      const json = await res.json();
      if (json.status === 'success') setData(json.data);
    } catch (err) {
      console.log('SparringScreen fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleRoutine = (num) => setExpandedRoutine(expandedRoutine === num ? null : num);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" backgroundColor="#006CB5" />
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Sparring</Text>
          <View style={{ width: 32 }} />
        </View>
        <ActivityIndicator size="large" color="#006CB5" style={{ marginTop: 60 }} />
      </SafeAreaView>
    );
  }

  if (!data) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" backgroundColor="#006CB5" />
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Sparring</Text>
          <View style={{ width: 32 }} />
        </View>
        <Text style={styles.emptyText}>Content not available.</Text>
      </SafeAreaView>
    );
  }

  const isFreeSparring = data.type === 'free';

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#006CB5" />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color="#fff" type="MaterialIcons" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{data.title}</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* What Is */}
        {!!data.whatIs && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What is {data.title.toLowerCase()}?</Text>
            <Text style={styles.bodyText}>{data.whatIs}</Text>
          </View>
        )}

        {/* Attacking */}
        {!!data.attackingIntro && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Attacking</Text>
            <Text style={styles.bodyText}>{data.attackingIntro}</Text>
            {(data.attacks || []).map((attack, i) => (
              <Text key={i} style={styles.bodyText}>
                <Text style={styles.bold}>{attack.num} </Text>{attack.text}
              </Text>
            ))}
          </View>
        )}

        {/* Defending */}
        {!!data.defending && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Defending</Text>
            <Text style={styles.bodyText}>{data.defending}</Text>
          </View>
        )}

        {/* Rule Sections (Free Sparring) */}
        {(data.sections || []).length > 0 && (
          <View>
            {data.sections.map((section, idx) => (
              <View key={idx} style={styles.section}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                {!!section.content && <Text style={styles.bodyText}>{section.content}</Text>}
                {(section.points || []).map((point, i) => (
                  <Text key={i} style={styles.bulletPoint}>• {point}</Text>
                ))}
                {/* Arena diagram for Layout section */}
                {(section.showArena || section.title.toLowerCase().includes('layout')) && <ArenaLayout />}
                {/* Section image uploaded via admin */}
                {!!section.image && (
                  <Image
                    source={{ uri: `${API_CONFIG.BASE_URL.replace('/api', '')}${section.image}` }}
                    style={styles.sectionImage}
                    resizeMode="contain"
                  />
                )}
              </View>
            ))}
          </View>
        )}

        {/* Routines */}
        {(data.routines || []).length > 0 && (
          <View>
            {data.routines.map((routine) => (
              <View key={routine.num} style={styles.routineContainer}>
                <TouchableOpacity
                  style={styles.routineHeader}
                  onPress={() => toggleRoutine(routine.num)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.routineNum}>No. {routine.num}</Text>
                  <View style={styles.readMoreBtn}>
                    <Text style={styles.readMoreText}>
                      {expandedRoutine === routine.num ? 'READ LESS' : 'READ MORE'}
                    </Text>
                  </View>
                </TouchableOpacity>
                {expandedRoutine === routine.num && (
                  <View style={styles.routineDetails}>
                    {!!routine.title && <Text style={styles.routineTitle}>{routine.title}</Text>}
                    
                    {/* New structure: title-detail pairs */}
                    {routine.titleDetailPairs && routine.titleDetailPairs.length > 0 ? (
                      routine.titleDetailPairs.map((pair, pairIndex) => (
                        <View key={pairIndex} style={styles.titleDetailSection}>
                          {!!pair.title && (
                            <Text style={styles.sectionSubtitle}>{pair.title}</Text>
                          )}
                          {(pair.details || []).map((detail, i) => (
                            <Text key={i} style={styles.detailText}>{detail}</Text>
                          ))}
                        </View>
                      ))
                    ) : (
                      /* Fallback for old structure */
                      (routine.details || []).map((detail, i) => (
                        <Text key={i} style={styles.detailText}>{detail}</Text>
                      ))
                    )}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

// Arena layout diagram (static visual)
function ArenaLayout() {
  return (
    <View style={styles.arenaContainer}>
      <View style={styles.tableTop}><Text style={styles.tableLabel}>T</Text></View>
      <View style={styles.arenaFullWrapper}>
        <View style={styles.topUmpires}>
          <Text style={styles.umpireLabel}>U</Text>
          <View style={{ flex: 1 }} />
          <Text style={styles.umpireLabel}>U</Text>
        </View>
        <View style={styles.arenaWrapper}>
          <View style={styles.umpireLeft}><Text style={styles.umpireLabel}>U</Text></View>
          <View style={styles.arena}>
            <View style={styles.arenaInner}>
              <Text style={styles.chong}>CHONG</Text>
              <Text style={styles.referee}>R</Text>
              <Text style={styles.hong}>HONG</Text>
            </View>
          </View>
          <View style={styles.umpireRight}><Text style={styles.umpireLabel}>U</Text></View>
        </View>
        <View style={styles.bottomUmpires}>
          <Text style={styles.umpireLabel}>U</Text>
          <View style={{ flex: 1 }} />
          <Text style={styles.umpireLabel}>U</Text>
        </View>
      </View>
      <View style={styles.dimensionLabels}>
        <Text style={styles.dimensionLabel}>10m</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f0f0f0' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#006CB5', paddingHorizontal: 16, paddingVertical: 12,
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', flex: 1, textAlign: 'center' },
  backBtn: { padding: 8 },
  scroll: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  section: { marginBottom: 24, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#000', marginBottom: 12 },
  bodyText: { fontSize: 14, lineHeight: 22, color: '#333', marginBottom: 8 },
  bold: { fontWeight: 'bold', color: '#006CB5' },
  bulletPoint: { fontSize: 14, lineHeight: 22, color: '#333', marginBottom: 8 },
  emptyText: { textAlign: 'center', color: '#9ca3af', marginTop: 60, fontSize: 14 },
  routineContainer: {
    marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb',
    paddingHorizontal: 16,
  },
  routineHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16,
  },
  routineNum: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  readMoreBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 2, borderColor: '#006CB5' },
  readMoreText: { color: '#006CB5', fontWeight: 'bold', fontSize: 12 },
  routineDetails: { paddingVertical: 12 },
  routineTitle: { fontSize: 14, fontWeight: 'bold', color: '#000', marginBottom: 12 },
  titleDetailSection: { marginBottom: 16 },
  sectionSubtitle: { fontSize: 13, fontWeight: 'bold', color: '#006CB5', marginBottom: 8 },
  detailText: { fontSize: 13, lineHeight: 20, color: '#333', marginBottom: 8 },
  scoringImage: { width: '100%', height: 400, marginTop: 16, marginBottom: 16 },
  sectionImage: { width: '100%', height: 300, marginTop: 16, marginBottom: 8, borderRadius: 8 },
  arenaContainer: { marginTop: 20, alignItems: 'center', paddingHorizontal: 16 },
  tableTop: { width: 120, height: 20, backgroundColor: '#000', marginBottom: 12, borderRadius: 4, justifyContent: 'center', alignItems: 'center' },
  tableLabel: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  arenaFullWrapper: { alignItems: 'center' },
  topUmpires: { flexDirection: 'row', width: 240, justifyContent: 'space-between', marginBottom: 8 },
  arenaWrapper: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  umpireLeft: { width: 30, height: 200, justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  umpireRight: { width: 30, height: 200, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  bottomUmpires: { flexDirection: 'row', width: 240, justifyContent: 'space-between' },
  umpireLabel: { fontSize: 14, fontWeight: 'bold', color: '#000' },
  arena: { width: 200, height: 200, backgroundColor: '#22c55e', justifyContent: 'center', alignItems: 'center' },
  arenaInner: { width: '90%', height: '90%', backgroundColor: '#4ade80', justifyContent: 'center', alignItems: 'center', position: 'relative' },
  chong: { position: 'absolute', left: 10, top: '50%', transform: [{ translateY: -12 }], fontSize: 16, fontWeight: 'bold', color: '#006CB5' },
  hong: { position: 'absolute', right: 10, top: '50%', transform: [{ translateY: -12 }], fontSize: 16, fontWeight: 'bold', color: '#dc2626' },
  referee: { fontSize: 14, fontWeight: 'bold', color: '#000' },
  dimensionLabels: { marginTop: 8, alignItems: 'center' },
  dimensionLabel: { fontSize: 12, color: '#666' },
});

export default SparringScreen;
