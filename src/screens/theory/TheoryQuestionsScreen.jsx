import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, StatusBar,
  TouchableOpacity, Modal, ScrollView,
} from 'react-native';
import { spacing } from '../../theme';
import Icon from '../../components/common/Icon';

const BLUE = '#006CB5';

const BELTS = [
  { kup: '10th Kup', colors: ['#fff'] },
  { kup: '9th Kup',  colors: ['#fff', '#f5c518'] },
  { kup: '8th Kup',  colors: ['#f5c518'] },
  { kup: '7th Kup',  colors: ['#f5c518', '#2e7d32'] },
  { kup: '6th Kup',  colors: ['#2e7d32'] },
  { kup: '5th Kup',  colors: ['#2e7d32', '#1565c0'] },
  { kup: '4th Kup',  colors: ['#1565c0'] },
  { kup: '3rd Kup',  colors: ['#1565c0', '#c62828'] },
  { kup: '2nd Kup',  colors: ['#c62828'] },
  { kup: '1st Kup',  colors: ['#c62828', '#000'] },
  { kup: '1st Dan',  colors: ['#000'] },
];
const ALL_COLORS = ['#fff', '#f5c518', '#2e7d32', '#1565c0', '#c62828'];

const QUESTIONS = {
  '10th Kup': [
    { q: 'What is Inner Forearm in Korean?',  options: ['Ap Kumchi','Sonbadok','An Palmok','Ap Joomuk'],        answer: 'An Palmok' },
    { q: 'What is Block in Korean?',          options: ['Charyot','Makgi','Jirugi','Junbi'],                    answer: 'Makgi' },
    { q: 'What is Punch in Korean?',          options: ['Makgi','Chagi','Jirugi','Sogi'],                       answer: 'Jirugi' },
    { q: 'What is Kick in Korean?',           options: ['Jirugi','Makgi','Chagi','Junbi'],                      answer: 'Chagi' },
    { q: 'What is Attention in Korean?',      options: ['Junbi','Charyot','Sijak','Kyong-ye'],                  answer: 'Charyot' },
    { q: 'What is Ready in Korean?',          options: ['Charyot','Sijak','Junbi','Goman'],                     answer: 'Junbi' },
    { q: 'What is Bow in Korean?',            options: ['Junbi','Charyot','Kyong-ye','Sijak'],                  answer: 'Kyong-ye' },
    { q: 'What is Start in Korean?',          options: ['Goman','Junbi','Kyong-ye','Sijak'],                    answer: 'Sijak' },
    { q: 'What is Stop in Korean?',           options: ['Sijak','Goman','Junbi','Charyot'],                     answer: 'Goman' },
    { q: 'What is Front Kick in Korean?',     options: ['Dollyo Chagi','Yop Chagi','Ap Chagi','Dwit Chagi'],   answer: 'Ap Chagi' },
    { q: 'What does "Tae" mean?',             options: ['Hand','Way','Foot','Fist'],                            answer: 'Foot' },
    { q: 'What does "Kwon" mean?',            options: ['Way','Foot','Spirit','Fist/Hand'],                     answer: 'Fist/Hand' },
    { q: 'What does "Do" mean?',              options: ['Kick','Punch','Way/Art','Block'],                      answer: 'Way/Art' },
    { q: 'Who founded ITF Taekwon-Do?',       options: ['Bruce Lee','Gen. Choi Hong Hi','Kim Il-sung','Park Jung-tae'], answer: 'Gen. Choi Hong Hi' },
    { q: 'When was ITF founded?',             options: ['1955','1960','1966','1972'],                           answer: '1966' },
    { q: 'How many tenets are there?',        options: ['3','4','5','6'],                                       answer: '5' },
    { q: 'First tenet of Taekwon-Do?',        options: ['Integrity','Courtesy','Perseverance','Self-Control'],  answer: 'Courtesy' },
    { q: 'What is Indomitable Spirit?',       options: ['Ye Ui','Yom Chi','In Nae','Baekjul Boolgool'],        answer: 'Baekjul Boolgool' },
    { q: 'How many ITF patterns?',            options: ['20','22','24','26'],                                   answer: '24' },
    { q: 'What is Outer Forearm in Korean?',  options: ['An Palmok','Dung Joomuk','Bakat Palmok','Sonkal'],    answer: 'Bakat Palmok' },
    { q: 'What is Knife Hand in Korean?',     options: ['Palmok','Sonkal','Joomuk','Sonbadok'],                 answer: 'Sonkal' },
    { q: 'What is Turning Kick in Korean?',   options: ['Ap Chagi','Yop Chagi','Dollyo Chagi','Dwit Chagi'],   answer: 'Dollyo Chagi' },
    { q: 'What is Side Kick in Korean?',      options: ['Ap Chagi','Dollyo Chagi','Yop Chagi','Bandal Chagi'], answer: 'Yop Chagi' },
    { q: 'What is Back Kick in Korean?',      options: ['Yop Chagi','Dollyo Chagi','Ap Chagi','Dwit Chagi'],   answer: 'Dwit Chagi' },
    { q: 'What is Palm in Korean?',           options: ['Sonkal','Joomuk','Sonbadok','Palmok'],                 answer: 'Sonbadok' },
  ],
  '9th Kup': [
    { q: 'What is Walking Stance in Korean?', options: ['Niunja Sogi','Gunnun Sogi','Moa Sogi','Annun Sogi'],  answer: 'Gunnun Sogi' },
    { q: 'What is L-Stance in Korean?',       options: ['Gunnun Sogi','Niunja Sogi','Annun Sogi','Moa Sogi'], answer: 'Niunja Sogi' },
    { q: 'What is Sitting Stance in Korean?', options: ['Gunnun Sogi','Niunja Sogi','Annun Sogi','Moa Sogi'], answer: 'Annun Sogi' },
    { q: 'What is Closed Stance in Korean?',  options: ['Annun Sogi','Gunnun Sogi','Moa Sogi','Niunja Sogi'], answer: 'Moa Sogi' },
    { q: 'What is High Section in Korean?',   options: ['Najunde','Kaunde','Nopunde','Bandae'],                answer: 'Nopunde' },
    { q: 'What is Middle Section in Korean?', options: ['Nopunde','Najunde','Kaunde','Baro'],                  answer: 'Kaunde' },
    { q: 'What is Low Section in Korean?',    options: ['Kaunde','Nopunde','Najunde','Baro'],                  answer: 'Najunde' },
    { q: 'What is Reverse in Korean?',        options: ['Baro','Bandae','Nopunde','Kaunde'],                   answer: 'Bandae' },
    { q: 'What is Return in Korean?',         options: ['Bandae','Baro','Kaunde','Nopunde'],                   answer: 'Baro' },
    { q: 'What is Forearm in Korean?',        options: ['Joomuk','Sonkal','Palmok','Sonbadok'],                answer: 'Palmok' },
    { q: 'What is Fist in Korean?',           options: ['Palmok','Sonkal','Joomuk','Sonbadok'],                answer: 'Joomuk' },
    { q: 'What is Crescent Kick in Korean?',  options: ['Dollyo Chagi','Bandal Chagi','Yop Chagi','Ap Chagi'],answer: 'Bandal Chagi' },
    { q: 'What is Instep in Korean?',         options: ['Balbadak','Ap Kumchi','Dwitchook','Baldung'],         answer: 'Baldung' },
    { q: 'What is Ball of Foot in Korean?',   options: ['Baldung','Dwitchook','Ap Kumchi','Balbadak'],         answer: 'Ap Kumchi' },
    { q: 'What is Heel in Korean?',           options: ['Ap Kumchi','Baldung','Dwitchook','Balbadak'],         answer: 'Dwitchook' },
    { q: 'What is Sole in Korean?',           options: ['Ap Kumchi','Baldung','Dwitchook','Balbadak'],         answer: 'Balbadak' },
    { q: 'What is Elbow in Korean?',          options: ['Palmok','Joomuk','Palkup','Sonkal'],                  answer: 'Palkup' },
    { q: 'What is Knee in Korean?',           options: ['Palkup','Moorup','Palmok','Joomuk'],                  answer: 'Moorup' },
    { q: 'What is Taekwon-Do?',               options: ['A sport','Korean art of self-defence','A dance','A weapon'], answer: 'Korean art of self-defence' },
    { q: 'Second tenet of Taekwon-Do?',       options: ['Courtesy','Integrity','Perseverance','Self-Control'], answer: 'Integrity' },
    { q: 'Third tenet of Taekwon-Do?',        options: ['Courtesy','Integrity','Perseverance','Self-Control'], answer: 'Perseverance' },
    { q: 'Fourth tenet of Taekwon-Do?',       options: ['Courtesy','Integrity','Perseverance','Self-Control'], answer: 'Self-Control' },
    { q: 'Fifth tenet of Taekwon-Do?',        options: ['Courtesy','Integrity','Perseverance','Indomitable Spirit'], answer: 'Indomitable Spirit' },
    { q: 'What is Courtesy in Korean?',       options: ['Yom Chi','Ye Ui','In Nae','Guk Gi'],                  answer: 'Ye Ui' },
    { q: 'What is Integrity in Korean?',      options: ['Ye Ui','Yom Chi','In Nae','Guk Gi'],                  answer: 'Yom Chi' },
  ],
};

// Fill remaining belts
['8th Kup','7th Kup','6th Kup','5th Kup','4th Kup','3rd Kup','2nd Kup','1st Kup','1st Dan'].forEach(k => {
  QUESTIONS[k] = [
    { q: 'What is Perseverance in Korean?',   options: ['Ye Ui','Yom Chi','In Nae','Guk Gi'],                  answer: 'In Nae' },
    { q: 'What is Self-Control in Korean?',   options: ['Ye Ui','Yom Chi','In Nae','Guk Gi'],                  answer: 'Guk Gi' },
    { q: 'What is Indomitable Spirit?',       options: ['Ye Ui','Yom Chi','In Nae','Baekjul Boolgool'],        answer: 'Baekjul Boolgool' },
    { q: 'When was Taekwon-Do named?',        options: ['April 11, 1955','March 22, 1966','June 1, 1960','Jan 1, 1970'], answer: 'April 11, 1955' },
    { q: 'When was ITF founded?',             options: ['1955','1960','1966','1972'],                           answer: '1966' },
    { q: 'How many ITF patterns?',            options: ['20','22','24','26'],                                   answer: '24' },
    { q: 'First ITF pattern?',                options: ['Dan-Gun','Chon-Ji','Do-San','Won-Hyo'],                answer: 'Chon-Ji' },
    { q: 'What does Chon-Ji mean?',           options: ['Heaven and Earth','Mountain','Patriot','Philosopher'], answer: 'Heaven and Earth' },
    { q: 'What is High Section in Korean?',   options: ['Najunde','Kaunde','Nopunde','Bandae'],                 answer: 'Nopunde' },
    { q: 'What is Middle Section in Korean?', options: ['Nopunde','Najunde','Kaunde','Baro'],                   answer: 'Kaunde' },
    { q: 'What is Low Section in Korean?',    options: ['Kaunde','Nopunde','Najunde','Baro'],                   answer: 'Najunde' },
    { q: 'What is Punch in Korean?',          options: ['Makgi','Chagi','Jirugi','Sogi'],                       answer: 'Jirugi' },
    { q: 'What is Block in Korean?',          options: ['Charyot','Makgi','Jirugi','Junbi'],                    answer: 'Makgi' },
    { q: 'What is Kick in Korean?',           options: ['Jirugi','Makgi','Chagi','Junbi'],                      answer: 'Chagi' },
    { q: 'What is Stance in Korean?',         options: ['Chagi','Makgi','Jirugi','Sogi'],                       answer: 'Sogi' },
    { q: 'What is Knife Hand in Korean?',     options: ['Palmok','Sonkal','Joomuk','Sonbadok'],                 answer: 'Sonkal' },
    { q: 'What is Forearm in Korean?',        options: ['Joomuk','Sonkal','Palmok','Sonbadok'],                 answer: 'Palmok' },
    { q: 'What is Fist in Korean?',           options: ['Palmok','Sonkal','Joomuk','Sonbadok'],                 answer: 'Joomuk' },
    { q: 'What is Elbow in Korean?',          options: ['Palmok','Joomuk','Palkup','Sonkal'],                   answer: 'Palkup' },
    { q: 'What is Knee in Korean?',           options: ['Palkup','Moorup','Palmok','Joomuk'],                   answer: 'Moorup' },
    { q: 'What is Turning Kick in Korean?',   options: ['Ap Chagi','Yop Chagi','Dollyo Chagi','Dwit Chagi'],   answer: 'Dollyo Chagi' },
    { q: 'What is Side Kick in Korean?',      options: ['Ap Chagi','Dollyo Chagi','Yop Chagi','Bandal Chagi'], answer: 'Yop Chagi' },
    { q: 'What is Back Kick in Korean?',      options: ['Yop Chagi','Dollyo Chagi','Ap Chagi','Dwit Chagi'],   answer: 'Dwit Chagi' },
    { q: 'What is Front Kick in Korean?',     options: ['Dollyo Chagi','Yop Chagi','Ap Chagi','Dwit Chagi'],   answer: 'Ap Chagi' },
    { q: 'Who founded ITF Taekwon-Do?',       options: ['Bruce Lee','Gen. Choi Hong Hi','Kim Il-sung','Park Jung-tae'], answer: 'Gen. Choi Hong Hi' },
  ];
});

const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);
const getQuestions = (belt) => shuffle([...(QUESTIONS[belt.kup] || [])]);

// ─── Swatches ─────────────────────────────────────────────────────────────────
const BeltSwatch = ({ belt, size = 44 }) => (
  <View style={[styles.swatch, { width: size, height: size }]}>
    {belt.colors.map((c, i) => (
      <View key={i} style={{ flex: 1, backgroundColor: c, borderLeftWidth: i === 0 ? 1.5 : 0, borderRightWidth: i === belt.colors.length - 1 ? 1.5 : 0, borderTopWidth: 1.5, borderBottomWidth: 1.5, borderColor: '#222' }} />
    ))}
  </View>
);
const RainbowSwatch = ({ size = 44 }) => (
  <View style={[styles.swatch, { width: size, height: size }]}>
    {ALL_COLORS.map((c, i) => (
      <View key={i} style={{ flex: 1, backgroundColor: c, borderLeftWidth: i === 0 ? 1.5 : 0, borderRightWidth: i === ALL_COLORS.length - 1 ? 1.5 : 0, borderTopWidth: 1.5, borderBottomWidth: 1.5, borderColor: '#222' }} />
    ))}
  </View>
);

const TheoryQuestionsScreen = ({ onBack }) => {
  const [selectedBelt, setSelectedBelt] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [totalWrong, setTotalWrong] = useState(0);
  const [statsOpen, setStatsOpen] = useState(false);

  const startQuiz = useCallback((belt) => {
    setQuestions(getQuestions(belt));
    setQIndex(0); setChosen(null);
    setScore(0); setTotalAnswered(0); setTotalWrong(0);
  }, []);

  const handleBeltSelect = (belt) => { setSelectedBelt(belt); setDropdownOpen(false); startQuiz(belt); };

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
        {/* Belt selector */}
        <TouchableOpacity style={styles.beltSelector} onPress={() => setDropdownOpen(true)} activeOpacity={0.85}>
          {selectedBelt ? <BeltSwatch belt={selectedBelt} size={48} /> : <RainbowSwatch size={48} />}
          <Text style={styles.beltSelectorText}>{selectedBelt ? selectedBelt.kup : 'Press to Select Belt'}</Text>
          <Icon name="arrow-drop-down" size={28} color="#555" type="MaterialIcons" />
        </TouchableOpacity>

        {!selectedBelt ? (
          <Text style={styles.selectPrompt}>Select your belt</Text>
        ) : currentQ ? (
          <View style={styles.questionBox}>
            <Text style={styles.qCounter}>Question {totalAnswered + 1}</Text>
            <Text style={styles.questionText}>{currentQ.q}</Text>
            <View style={styles.optionsGrid}>
              {currentQ.options.map((opt) => (
                <TouchableOpacity key={opt} style={optionStyle(opt)} onPress={() => handleAnswer(opt)} activeOpacity={answered ? 1 : 0.75}>
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
      </ScrollView>

      {/* Belt dropdown */}
      <Modal visible={dropdownOpen} transparent animationType="fade" onRequestClose={() => setDropdownOpen(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setDropdownOpen(false)}>
          <View style={styles.dropdownBox}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <TouchableOpacity style={styles.dropdownHeader} onPress={() => { setSelectedBelt(null); setDropdownOpen(false); }} activeOpacity={0.7}>
                <RainbowSwatch size={52} /><Text style={styles.dropdownHeaderText}>Press to Select Belt</Text>
              </TouchableOpacity>
              {BELTS.map((belt) => (
                <TouchableOpacity key={belt.kup} style={[styles.dropdownItem, selectedBelt?.kup === belt.kup && styles.dropdownItemActive]} onPress={() => handleBeltSelect(belt)} activeOpacity={0.7}>
                  <BeltSwatch belt={belt} size={52} />
                  <Text style={[styles.dropdownItemText, selectedBelt?.kup === belt.kup && styles.dropdownItemTextActive]}>{belt.kup}</Text>
                  {selectedBelt?.kup === belt.kup && <Icon name="check" size={20} color={BLUE} type="MaterialIcons" />}
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

            {/* Header */}
            <View style={styles.statsHeader}>
              <Text style={styles.statsTitle}>Statistics</Text>
              <TouchableOpacity onPress={() => setStatsOpen(false)} activeOpacity={0.7}>
                <Icon name="close" size={24} color="#1f2937" type="MaterialIcons" />
              </TouchableOpacity>
            </View>

            {/* Belt badge */}
            {selectedBelt && (
              <View style={styles.statsBeltBadge}>
                <BeltSwatch belt={selectedBelt} size={32} />
                <Text style={styles.statsBeltName}>{selectedBelt.kup}</Text>
              </View>
            )}

            {/* Top row: accuracy circle + score summary */}
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

            {/* Progress bar */}
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

            {/* Performance message */}
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
  selectPrompt: { fontSize: 22, fontWeight: '600', color: '#333', marginBottom: 30 },
  // Question
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
  // Score
  countBox: { alignItems: 'center', marginBottom: 20 },
  countNumber: { fontSize: 36, fontWeight: '800', color: '#1f2937' },
  countLabel: { fontSize: 14, color: '#6b7280' },
  // Stats button
  statsBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: BLUE, borderRadius: 10, paddingVertical: 14, paddingHorizontal: 40 },
  statsBtnDisabled: { backgroundColor: '#9ca3af' },
  statsBtnText: { fontSize: 16, fontWeight: '800', color: '#fff', letterSpacing: 1.5 },
  statsHint: { fontSize: 12, color: '#9ca3af', marginTop: 8, textAlign: 'center' },
  // Dropdown
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', alignItems: 'center' },
  dropdownBox: { backgroundColor: '#b8b8b8', borderRadius: 12, width: '85%', maxHeight: '80%', paddingVertical: 8 },
  dropdownHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.1)' },
  dropdownHeaderText: { fontSize: 18, fontWeight: '600', color: '#222', marginLeft: 14 },
  dropdownItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.08)' },
  dropdownItemActive: { backgroundColor: 'rgba(0,108,181,0.1)' },
  dropdownItemText: { flex: 1, fontSize: 18, fontWeight: '500', color: '#222', marginLeft: 14 },
  dropdownItemTextActive: { color: BLUE, fontWeight: '700' },
  // Stats modal
  statsOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  statsBox: { backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 44 },
  statsHandle: { width: 40, height: 4, backgroundColor: '#e5e7eb', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  statsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  statsTitle: { fontSize: 22, fontWeight: '800', color: '#1f2937' },
  statsBeltBadge: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#f0f6fb', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, alignSelf: 'flex-start', marginBottom: 20 },
  statsBeltName: { fontSize: 15, fontWeight: '700', color: BLUE },
  // Top row
  statsTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, gap: 20 },
  accuracyWrap: { alignItems: 'center' },
  accuracyCircle: { width: 100, height: 100, borderRadius: 50, borderWidth: 6, borderColor: BLUE, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f6fb' },
  accuracyNum: { fontSize: 24, fontWeight: '900', color: BLUE },
  accuracyLabel: { fontSize: 11, color: '#6b7280', fontWeight: '600' },
  // Summary list
  statsSummary: { flex: 1, backgroundColor: '#f9fafb', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 8 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  summaryDot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  summaryLabel: { flex: 1, fontSize: 14, color: '#374151', fontWeight: '500' },
  summaryVal: { fontSize: 22, fontWeight: '900' },
  summaryDivider: { height: 1, backgroundColor: '#e5e7eb' },
  // Progress
  progressSection: { marginBottom: 16 },
  progressLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressLabelText: { fontSize: 13, fontWeight: '700', color: '#1f2937' },
  progressPct: { fontSize: 13, fontWeight: '700', color: BLUE },
  progressTrack: { height: 12, backgroundColor: '#e5e7eb', borderRadius: 6, overflow: 'hidden', marginBottom: 4, flexDirection: 'row' },
  progressFill: { height: '100%', borderRadius: 6 },
  progressSide: { fontSize: 11, color: '#9ca3af' },
  // Performance box
  perfBox: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 12, padding: 14 },
  perfText: { fontSize: 14, fontWeight: '600', flex: 1 },
});

export default TheoryQuestionsScreen;
