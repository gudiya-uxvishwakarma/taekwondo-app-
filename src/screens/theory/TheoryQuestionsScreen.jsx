import React, { useState, useCallback, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, StatusBar,
  TouchableOpacity, Modal, ScrollView, ActivityIndicator,
} from 'react-native';
import { spacing } from '../../theme';
import Icon from '../../components/common/Icon';
import API_CONFIG from '../../config/api';

const BLUE = '#006CB5';
const ALL_COLORS = ['#fff', '#f5c518', '#2e7d32', '#1565c0', '#c62828'];

const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

// ─── Swatches ─────────────────────────────────────────────────────────────────
const BeltSwatch = ({ size = 44 }) => (
  <View style={[styles.swatch, { width: size, height: size }]}>
    {ALL_COLORS.map((c, i) => (
      <View key={i} style={{ flex: 1, backgroundColor: c, borderLeftWidth: i === 0 ? 1.5 : 0, borderRightWidth: i === ALL_COLORS.length - 1 ? 1.5 : 0, borderTopWidth: 1.5, borderBottomWidth: 1.5, borderColor: '#222' }} />
    ))}
  </View>
);

const TheoryQuestionsScreen = ({ onBack }) => {
  const [belts, setBelts] = useState([]);           // unique belt names from API
  const [allQuestions, setAllQuestions] = useState({}); // { beltName: [questions] }
  const [loadingData, setLoadingData] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  const [selectedBelt, setSelectedBelt] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [totalWrong, setTotalWrong] = useState(0);
  const [statsOpen, setStatsOpen] = useState(false);

  // Fetch all questions from API on mount
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoadingData(true);
      setFetchError(false);
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.THEORY_QUESTIONS.LIST}`);
        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        if (data.status === 'success' && data.data?.length > 0) {
          // Group by beltLevel
          const grouped = {};
          data.data.forEach(q => {
            if (!grouped[q.beltLevel]) grouped[q.beltLevel] = [];
            grouped[q.beltLevel].push({ q: q.question, options: q.options, answer: q.answer });
          });
          setAllQuestions(grouped);
          setBelts(Object.keys(grouped));
        } else {
          setBelts([]);
        }
      } catch {
        setFetchError(true);
        setBelts([]);
      }
      setLoadingData(false);
    };
    fetchQuestions();
  }, []);

  const startQuiz = useCallback((belt) => {
    const qs = allQuestions[belt] || [];
    setQuestions(shuffle([...qs]));
    setQIndex(0); setChosen(null);
    setScore(0); setTotalAnswered(0); setTotalWrong(0);
  }, [allQuestions]);

  const handleBeltSelect = (belt) => {
    setSelectedBelt(belt);
    setDropdownOpen(false);
    startQuiz(belt);
  };

  const handleAnswer = (option) => {
    if (chosen) return;
    setChosen(option);
    setTotalAnswered(t => t + 1);
    if (option === questions[qIndex]?.answer) setScore(s => s + 1);
    else setTotalWrong(w => w + 1);
  };

  const handleNext = () => { setChosen(null); setQIndex(i => (i + 1) % questions.length); };

  const currentQ = questions[qIndex];
  const answered = !!chosen;
  const statsUnlocked = totalAnswered >= 10;
  const accuracy = totalAnswered > 0 ? Math.round((score / totalAnswered) * 100) : 0;

  const optionStyle = (opt) => {
    if (!answered) return styles.optionBtn;
    if (opt === currentQ.answer) return [styles.optionBtn, styles.optionCorrect];
    if (opt === chosen) return [styles.optionBtn, styles.optionWrong];
    return styles.optionBtn;
  };
  const optionTextStyle = (opt) => {
    if (!answered) return styles.optionText;
    if (opt === currentQ.answer) return [styles.optionText, { color: '#16a34a', fontWeight: '700' }];
    if (opt === chosen) return [styles.optionText, { color: '#dc2626', fontWeight: '700' }];
    return styles.optionText;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={BLUE} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
          <Icon name="arrow-back" size={24} color="#fff" type="MaterialIcons" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Theory Questions</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {loadingData ? (
          <ActivityIndicator size="large" color={BLUE} style={{ marginTop: 60 }} />
        ) : fetchError ? (
          <Text style={styles.selectPrompt}>Failed to load questions. Check connection.</Text>
        ) : belts.length === 0 ? (
          <Text style={styles.selectPrompt}>No questions available yet.</Text>
        ) : (
          <>
            {/* Belt selector */}
            <TouchableOpacity style={styles.beltSelector} onPress={() => setDropdownOpen(true)} activeOpacity={0.85}>
              <BeltSwatch size={48} />
              <Text style={styles.beltSelectorText}>{selectedBelt || 'Press to Select Belt'}</Text>
              <Icon name="arrow-drop-down" size={28} color="#555" type="MaterialIcons" />
            </TouchableOpacity>

            {!selectedBelt ? (
              <Text style={styles.selectPrompt}>Select your belt</Text>
            ) : currentQ ? (
              <View style={styles.questionBox}>
                <Text style={styles.qCounter}>Question {totalAnswered + 1}</Text>
                <Text style={styles.questionText}>{currentQ.q}</Text>
                <View style={styles.optionsGrid}>
                  {currentQ.options.map((opt, optIdx) => (
                    <TouchableOpacity key={optIdx} style={optionStyle(opt)} onPress={() => handleAnswer(opt)} activeOpacity={answered ? 1 : 0.75}>
                      <Text style={optionTextStyle(opt)}>{opt}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {answered && (
                  <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.8}>
                    <Text style={styles.nextBtnText}>NEXT</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : null}

            {selectedBelt && (
              <>
                <View style={styles.countBox}>
                  <Text style={styles.countNumber}>{score}</Text>
                  <Text style={styles.countLabel}>Correct today</Text>
                </View>
                <TouchableOpacity
                  style={[styles.statsBtn, !statsUnlocked && styles.statsBtnDisabled]}
                  onPress={() => statsUnlocked && setStatsOpen(true)}
                  activeOpacity={statsUnlocked ? 0.8 : 1}
                >
                  <Icon name="bar-chart" size={20} color="#fff" type="MaterialIcons" />
                  <Text style={styles.statsBtnText}>STATISTICS</Text>
                </TouchableOpacity>
                {!statsUnlocked && (
                  <Text style={styles.statsHint}>Answer {10 - totalAnswered} more to unlock</Text>
                )}
              </>
            )}
          </>
        )}
      </ScrollView>

      {/* Belt dropdown */}
      <Modal visible={dropdownOpen} transparent animationType="fade" onRequestClose={() => setDropdownOpen(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setDropdownOpen(false)}>
          <View style={styles.dropdownBox}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <TouchableOpacity style={styles.dropdownHeader} onPress={() => { setSelectedBelt(null); setDropdownOpen(false); }} activeOpacity={0.7}>
                <BeltSwatch size={52} />
                <Text style={styles.dropdownHeaderText}>Press to Select Belt</Text>
              </TouchableOpacity>
              {belts.map((belt) => (
                <TouchableOpacity
                  key={belt}
                  style={[styles.dropdownItem, selectedBelt === belt && styles.dropdownItemActive]}
                  onPress={() => handleBeltSelect(belt)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.dropdownItemText, selectedBelt === belt && styles.dropdownItemTextActive]}>{belt}</Text>
                  {selectedBelt === belt && <Icon name="check" size={20} color={BLUE} type="MaterialIcons" />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Statistics modal */}
      <Modal visible={statsOpen} transparent animationType="slide" onRequestClose={() => setStatsOpen(false)}>
        <View style={styles.statsOverlay}>
          <View style={styles.statsBox}>
            <View style={styles.statsHandle} />
            <View style={styles.statsHeader}>
              <Text style={styles.statsTitle}>Statistics</Text>
              <TouchableOpacity onPress={() => setStatsOpen(false)} activeOpacity={0.7}>
                <Icon name="close" size={24} color="#1f2937" type="MaterialIcons" />
              </TouchableOpacity>
            </View>

            {selectedBelt && (
              <View style={styles.statsBeltBadge}>
                <Text style={styles.statsBeltName}>{selectedBelt}</Text>
              </View>
            )}

            <View style={styles.statsTopRow}>
              <View style={styles.accuracyWrap}>
                <View style={styles.accuracyCircle}>
                  <Text style={styles.accuracyNum}>{accuracy}%</Text>
                  <Text style={styles.accuracyLabel}>Accuracy</Text>
                </View>
              </View>
              <View style={styles.statsSummary}>
                <View style={styles.summaryRow}>
                  <View style={[styles.summaryDot, { backgroundColor: BLUE }]} />
                  <Text style={styles.summaryLabel}>Answered</Text>
                  <Text style={[styles.summaryVal, { color: BLUE }]}>{totalAnswered}</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryRow}>
                  <View style={[styles.summaryDot, { backgroundColor: '#16a34a' }]} />
                  <Text style={styles.summaryLabel}>Correct</Text>
                  <Text style={[styles.summaryVal, { color: '#16a34a' }]}>{score}</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryRow}>
                  <View style={[styles.summaryDot, { backgroundColor: '#dc2626' }]} />
                  <Text style={styles.summaryLabel}>Wrong</Text>
                  <Text style={[styles.summaryVal, { color: '#dc2626' }]}>{totalWrong}</Text>
                </View>
              </View>
            </View>

            <View style={styles.progressSection}>
              <View style={styles.progressLabelRow}>
                <Text style={styles.progressLabelText}>Correct rate</Text>
                <Text style={styles.progressPct}>{accuracy}%</Text>
              </View>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { flex: accuracy, backgroundColor: BLUE }]} />
                <View style={{ flex: 100 - accuracy }} />
              </View>
              <View style={styles.progressLabelRow}>
                <Text style={styles.progressSide}>0%</Text>
                <Text style={styles.progressSide}>100%</Text>
              </View>
            </View>

            <View style={[styles.perfBox, { backgroundColor: accuracy >= 80 ? '#f0fdf4' : accuracy >= 50 ? '#fffbeb' : '#fef2f2' }]}>
              <Icon
                name={accuracy >= 80 ? 'emoji-events' : accuracy >= 50 ? 'trending-up' : 'refresh'}
                size={20}
                color={accuracy >= 80 ? '#16a34a' : accuracy >= 50 ? '#d97706' : '#dc2626'}
                type="MaterialIcons"
              />
              <Text style={[styles.perfText, { color: accuracy >= 80 ? '#15803d' : accuracy >= 50 ? '#92400e' : '#991b1b' }]}>
                {accuracy >= 80 ? 'Excellent! Keep it up.' : accuracy >= 50 ? 'Good progress. Keep practising.' : 'Keep going — practice makes perfect.'}
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: BLUE, paddingHorizontal: spacing.md, paddingVertical: spacing.md },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  scroll: { padding: spacing.md, paddingTop: 80, alignItems: 'center' },
  swatch: { flexDirection: 'row', borderRadius: 4, overflow: 'hidden' },
  beltSelector: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#c8c8c8', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, width: '100%', marginBottom: 24 },
  beltSelectorText: { flex: 1, fontSize: 18, fontWeight: '600', color: '#222', marginLeft: 14 },
  selectPrompt: { fontSize: 22, fontWeight: '600', color: '#333', marginBottom: 30, textAlign: 'center' },
  questionBox: { width: '100%', alignItems: 'center', marginBottom: 20 },
  qCounter: { fontSize: 13, color: '#6b7280', fontWeight: '600', marginBottom: 8 },
  questionText: { fontSize: 20, fontWeight: '600', color: '#1f2937', textAlign: 'center', marginBottom: 20, lineHeight: 28 },
  optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', width: '100%', gap: 10 },
  optionBtn: { width: '48%', borderWidth: 2, borderColor: '#222', borderRadius: 8, paddingVertical: 14, alignItems: 'center', backgroundColor: '#fff' },
  optionCorrect: { borderColor: '#16a34a' },
  optionWrong: { borderColor: '#dc2626' },
  optionText: { fontSize: 15, fontWeight: '500', color: '#1f2937' },
  nextBtn: { marginTop: 16, backgroundColor: BLUE, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 48 },
  nextBtnText: { fontSize: 16, fontWeight: '800', color: '#fff', letterSpacing: 1.5 },
  countBox: { alignItems: 'center', marginBottom: 20 },
  countNumber: { fontSize: 36, fontWeight: '800', color: '#1f2937' },
  countLabel: { fontSize: 14, color: '#6b7280' },
  statsBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: BLUE, borderRadius: 10, paddingVertical: 14, paddingHorizontal: 40 },
  statsBtnDisabled: { backgroundColor: '#9ca3af' },
  statsBtnText: { fontSize: 16, fontWeight: '800', color: '#fff', letterSpacing: 1.5 },
  statsHint: { fontSize: 12, color: '#9ca3af', marginTop: 8, textAlign: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', alignItems: 'center' },
  dropdownBox: { backgroundColor: '#b8b8b8', borderRadius: 12, width: '85%', maxHeight: '80%', paddingVertical: 8 },
  dropdownHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.1)' },
  dropdownHeaderText: { fontSize: 18, fontWeight: '600', color: '#222', marginLeft: 14 },
  dropdownItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.08)' },
  dropdownItemActive: { backgroundColor: 'rgba(0,108,181,0.1)' },
  dropdownItemText: { flex: 1, fontSize: 18, fontWeight: '500', color: '#222' },
  dropdownItemTextActive: { color: BLUE, fontWeight: '700' },
  statsOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  statsBox: { backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 44 },
  statsHandle: { width: 40, height: 4, backgroundColor: '#e5e7eb', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  statsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  statsTitle: { fontSize: 22, fontWeight: '800', color: '#1f2937' },
  statsBeltBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f6fb', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, alignSelf: 'flex-start', marginBottom: 20 },
  statsBeltName: { fontSize: 15, fontWeight: '700', color: BLUE },
  statsTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, gap: 20 },
  accuracyWrap: { alignItems: 'center' },
  accuracyCircle: { width: 100, height: 100, borderRadius: 50, borderWidth: 6, borderColor: BLUE, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f6fb' },
  accuracyNum: { fontSize: 24, fontWeight: '900', color: BLUE },
  accuracyLabel: { fontSize: 11, color: '#6b7280', fontWeight: '600' },
  statsSummary: { flex: 1, backgroundColor: '#f9fafb', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 8 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  summaryDot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  summaryLabel: { flex: 1, fontSize: 14, color: '#374151', fontWeight: '500' },
  summaryVal: { fontSize: 22, fontWeight: '900' },
  summaryDivider: { height: 1, backgroundColor: '#e5e7eb' },
  progressSection: { marginBottom: 16 },
  progressLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressLabelText: { fontSize: 13, fontWeight: '700', color: '#1f2937' },
  progressPct: { fontSize: 13, fontWeight: '700', color: BLUE },
  progressTrack: { height: 12, backgroundColor: '#e5e7eb', borderRadius: 6, overflow: 'hidden', marginBottom: 4, flexDirection: 'row' },
  progressFill: { height: '100%', borderRadius: 6 },
  progressSide: { fontSize: 11, color: '#9ca3af' },
  perfBox: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 12, padding: 14 },
  perfText: { fontSize: 14, fontWeight: '600', flex: 1 },
});

export default TheoryQuestionsScreen;
