import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, SafeAreaView,
  StatusBar, TouchableOpacity, Linking,
} from 'react-native';
import { spacing } from '../../theme';
import Icon from '../../components/common/Icon';

const BLUE = '#006CB5';

const SOURCES = [
  {
    category: 'Books',
    icon: 'menu-book',
    items: [
      { title: 'Taekwon-Do Encyclopaedia', author: 'Gen. Choi Hong Hi', year: '1983', note: '15-volume definitive ITF reference covering all theory, patterns & techniques.' },
      { title: 'Condensed Encyclopaedia', author: 'Gen. Choi Hong Hi', year: '1999', note: 'Single-volume edition of the full ITF syllabus. Great for students & instructors.' },
      { title: 'ITF Official Patterns Book', author: 'ITF', year: '2000s', note: 'Step-by-step guide to all 24 ITF patterns (Tuls) with diagrams.' },
      { title: 'The Art of Self-Defence', author: 'Gen. Choi Hong Hi', year: '1965', note: 'The original book that introduced Taekwon-Do to the world.' },
    ],
  },
  {
    category: 'History & Philosophy',
    icon: 'history',
    items: [
      { title: 'Origins of Korean Martial Arts', author: 'Samguk Yusa', year: '13th C', note: 'Ancient texts documenting Subak & Taekkyon — the roots of Taekwon-Do.' },
      { title: 'Founding of the ITF', author: 'Gen. Choi Hong Hi', year: '1966', note: 'ITF founded on March 22, 1966 in Seoul. The art was named on April 11, 1955.' },
      { title: 'The Five Tenets', author: 'Gen. Choi Hong Hi', year: '—', note: 'Courtesy · Integrity · Perseverance · Self-Control · Indomitable Spirit.' },
      { title: 'The Student Oath', author: 'ITF', year: '—', note: 'Five pledges recited by all ITF students at every training session.' },
    ],
  },
  {
    category: 'Online',
    icon: 'language',
    items: [
      { title: 'ITF Official Website', author: 'itftkd.org', year: null, note: 'News, events, technical documents & official ITF rules.', url: 'https://www.itftkd.org' },
      { title: 'ITF Patterns Reference', author: 'itfpatterns.com', year: null, note: 'Detailed breakdowns of all 24 patterns with diagrams & videos.', url: 'https://www.itfpatterns.com' },
    ],
  },
  {
    category: 'Training Manuals',
    icon: 'description',
    items: [
      { title: 'Theory of Power', author: 'Gen. Choi Hong Hi', year: '—', note: '6 principles: Reaction Force · Concentration · Equilibrium · Breath Control · Mass · Speed.' },
      { title: 'Grading Syllabus', author: 'ITF National Associations', year: '—', note: 'Belt-by-belt requirements from 10th Kup (white) to 1st Dan (black belt).' },
      { title: 'Instructor Manual', author: 'ITF', year: '—', note: 'Teaching methods, class structure & grading examination procedures.' },
    ],
  },
  {
    category: 'Korean Language',
    icon: 'translate',
    items: [
      { title: 'ITF Korean Terminology', author: 'ITF Technical Committee', year: '—', note: 'Official Korean commands, technique names, stances & counting used in ITF.' },
      { title: 'Etymology of Taekwon-Do', author: 'Gen. Choi Hong Hi', year: '1955', note: 'Tae (foot) + Kwon (fist) + Do (way) — "The art of the foot and fist."' },
    ],
  },
];

const SourcesScreen = ({ onBack }) => (
  <SafeAreaView style={styles.safe}>
    <StatusBar barStyle="light-content" backgroundColor={BLUE} />
    <View style={styles.header}>
      <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
        <Icon name="arrow-back" size={24} color="#fff" type="MaterialIcons" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Sources</Text>
      <View style={{ width: 40 }} />
    </View>

    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      {SOURCES.map((sec) => (
        <View key={sec.category} style={styles.section}>
          <View style={styles.secHeader}>
            <View style={styles.secIcon}>
              <Icon name={sec.icon} size={16} color="#fff" type="MaterialIcons" />
            </View>
            <Text style={styles.secTitle}>{sec.category}</Text>
          </View>

          {sec.items.map((item, i) => (
            <View key={i} style={styles.card}>
              <View style={styles.cardRow}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                {item.year && <Text style={styles.cardYear}>{item.year}</Text>}
              </View>
              <Text style={styles.cardAuthor}>{item.author}</Text>
              <Text style={styles.cardNote}>{item.note}</Text>
              {item.url && (
                <TouchableOpacity style={styles.linkBtn} onPress={() => Linking.openURL(item.url)} activeOpacity={0.7}>
                  <Icon name="open-in-new" size={13} color="#fff" type="MaterialIcons" />
                  <Text style={styles.linkText}>Visit</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      ))}
      <View style={{ height: 40 }} />
    </ScrollView>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: BLUE, paddingHorizontal: spacing.md, paddingVertical: spacing.md,
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  scroll: { padding: spacing.md },
  section: { marginBottom: 24 },
  secHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  secIcon: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: BLUE, justifyContent: 'center', alignItems: 'center', marginRight: 8,
  },
  secTitle: { fontSize: 15, fontWeight: '800', color: BLUE },
  card: {
    backgroundColor: '#fff', borderRadius: 12, padding: 14,
    marginBottom: 8, borderLeftWidth: 3, borderLeftColor: '#cce4f7',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 3, elevation: 2,
  },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#1f2937', flex: 1, marginRight: 8 },
  cardYear: { fontSize: 12, color: BLUE, fontWeight: '700', backgroundColor: '#e0f0ff', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  cardAuthor: { fontSize: 12, color: '#6b7280', marginBottom: 4 },
  cardNote: { fontSize: 13, color: '#374151', lineHeight: 19 },
  linkBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    marginTop: 8, backgroundColor: BLUE, borderRadius: 7,
    paddingHorizontal: 10, paddingVertical: 5, alignSelf: 'flex-start',
  },
  linkText: { fontSize: 12, fontWeight: '600', color: '#fff' },
});

export default SourcesScreen;
