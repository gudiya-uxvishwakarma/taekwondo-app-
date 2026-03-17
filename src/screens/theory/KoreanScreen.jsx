import React from 'react';
import { View, Text, SafeAreaView, StatusBar, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const KoreanRow = ({ korean, english }) => (
  <View style={styles.row}>
    <Text style={styles.korean}>{korean}</Text>
    <Text style={styles.english}>{english}</Text>
  </View>
);

const SectionHeader = ({ title, korean }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionHeaderText}>{title} / <Text style={styles.green}>{korean}</Text></Text>
  </View>
);

const KoreanScreen = ({ onBack }) => {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>KOREAN</Text>
        <View style={{ width: 32 }} />
      </View>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        <SectionHeader title="Stances" korean="Sogi" />
        <KoreanRow korean="Gunnun" english="Walking" />
        <KoreanRow korean="Annun" english="Sitting" />
        <KoreanRow korean="Niunja" english="L-stance" />
        <KoreanRow korean="Narani" english="Parallel" />
        <KoreanRow korean="Charyot" english="Attention" />
        <KoreanRow korean="Gojung" english="Fixed" />
        <KoreanRow korean="Moa" english="Closed" />
        <KoreanRow korean="Guburyo" english="Bending" />
        <KoreanRow korean="Kyocha" english="X-stance" />
        <KoreanRow korean="Nachou" english="Low" />
        <KoreanRow korean="Dwitbal" english="Rear Foot" />
        <KoreanRow korean="Soojik" english="Vertical" />
        <KoreanRow korean="Waebal" english="One-Leg" />
        <KoreanRow korean="Sasun" english="Diagonal" />

        <SectionHeader title="Techniques" korean="Gibeob" />
        <KoreanRow korean="Jirugi" english="Punch" />
        <KoreanRow korean="Tulgi" english="Thrust" />
        <KoreanRow korean="Taerigi" english="Strike" />
        <KoreanRow korean="Makgi" english="Block" />
        <KoreanRow korean="Golcha" english="Hooking" />
        <KoreanRow korean="Miro" english="Pushing" />

        <View style={styles.spacer} />
        <KoreanRow korean="Yop Cha Jirugi" english="Piercing Kick" />
        <KoreanRow korean="Cha Busigi" english="Snap Kick" />
        <KoreanRow korean="Dollyo Chagi" english="Turning Kick" />
        <KoreanRow korean="Cha Olligi" english="Rising Kick" />
        <KoreanRow korean="Twimyo Chagi" english="Flying Kick" />
        <KoreanRow korean="Dwitcha Jirugi" english="Back Piercing Kick" />
        <KoreanRow korean="Bituro Chagi" english="Twisting Kick" />
        <KoreanRow korean="Suroh Chagi" english="Sweeping Kick" />
        <KoreanRow korean="Yopcha Tulgi" english="Thrusting Kick" />
        <KoreanRow korean="Nopi Chagi" english="High Kick" />
        <KoreanRow korean="Milgi Chagi" english="Pushing Kick" />
        <KoreanRow korean="Momchoogi" english="Checking Kick" />
        <KoreanRow korean="Golcho Chagi" english="Hooking Kick" />

        <View style={styles.spacer} />
        <KoreanRow korean="Doo" english="Double" />
        <KoreanRow korean="Noollo" english="Pressing" />
        <KoreanRow korean="Sang" english="Twin" />
        <KoreanRow korean="Daebi" english="Guarding" />
        <KoreanRow korean="Hechyo" english="Wedging" />
        <KoreanRow korean="Ollyo" english="Upward" />
        <KoreanRow korean="Annuro" english="Inward" />
        <KoreanRow korean="Naeryo" english="Downward" />
        <KoreanRow korean="Bakuro" english="Outwards" />
        <KoreanRow korean="Dwijibo" english="Upset" />
        <KoreanRow korean="Sewo" english="Vertical" />
        <KoreanRow korean="Chookyo" english="Rising" />
        <KoreanRow korean="Wi" english="Upper" />
        <KoreanRow korean="Dollimyo" english="Circular" />
        <KoreanRow korean="Twigi" english="Jumping" />
        <KoreanRow korean="Duro" english="Scooping" />
        <KoreanRow korean="Soopyong" english="Horizontal" />

        <View style={styles.spacer} />
        <KoreanRow korean="Ap" english="Front" />
        <KoreanRow korean="Yop" english="Side" />
        <KoreanRow korean="Dung" english="Back" />
        <KoreanRow korean="Yopap" english="Side Front" />

        <SectionHeader title="Numbers" korean="Susja" />
        <KoreanRow korean="Hana" english="One" />
        <KoreanRow korean="Dool" english="Two" />
        <KoreanRow korean="Set" english="Three" />
        <KoreanRow korean="Net" english="Four" />
        <KoreanRow korean="Tasut" english="Five" />
        <KoreanRow korean="Yasut" english="Six" />
        <KoreanRow korean="Ilgot" english="Seven" />
        <KoreanRow korean="Yodul" english="Eight" />
        <KoreanRow korean="Ahop" english="Nine" />
        <KoreanRow korean="Yol" english="Ten" />

        <SectionHeader title="Others" korean="Gita" />
        <KoreanRow korean="Dwijibun Sonkut" english="Upset Fingertips" />
        <KoreanRow korean="Opun Sonkut" english="Flat Fingertips" />
        <KoreanRow korean="Sun Sonkut" english="Straight Fingertips" />
        <KoreanRow korean="Homi Sonkut" english="Angle Fingertip" />

        <View style={styles.spacer} />
        <KoreanRow korean="Giokja Jirugi" english="Angle Punch" />
        <KoreanRow korean="Dollyo Jirugi" english="Turning Punch" />
        <KoreanRow korean="Bandal Jirugi" english="Crescent Punch" />

        <View style={styles.spacer} />
        <KoreanRow korean="Digutja Makgi" english="U-shaped Block" />
        <KoreanRow korean="San Makgi" english="W-shaped Block" />
        <KoreanRow korean="Momchau Makgi" english="Checking Block" />
        <KoreanRow korean="Gutja Makgi" english="9-Shape Block" />
        <KoreanRow korean="Hori Makgi" english="Waist Block" />

        <View style={styles.spacer} />
        <KoreanRow korean="Hanulson" english="Heaven Hand" />
        <KoreanRow korean="Bandalson" english="Arc Hand" />
        <KoreanRow korean="Bakuro Gutgi" english="Outwards Cross Cut" />
        <KoreanRow korean="Jap Sol Tae" english="Releasing Movement" />
        <KoreanRow korean="Ghin Joomuk" english="Long Fist" />
        <KoreanRow korean="Mit Joomuk" english="Under First" />
        <KoreanRow korean="Sonmokdung" english="Bow Wrist" />
        <KoreanRow korean="Songarak Joomuk" english="Knuckle Fist" />

        <View style={styles.spacer} />
        <KoreanRow korean="Baro" english="Obverse" />
        <KoreanRow korean="Bandae" english="Reverse" />
        <KoreanRow korean="Oran" english="Right" />
        <KoreanRow korean="Wen" english="Left" />

        <View style={styles.spacer} />
        <KoreanRow korean="Junbi" english="Ready" />
        <KoreanRow korean="Si-jak" english="Start" />
        <KoreanRow korean="Guman" english="Stop" />
        <KoreanRow korean="Pharo" english="Return" />
        <KoreanRow korean="Hae San" english="Dismissed" />
        <KoreanRow korean="Dojang" english="Training Hall" />

        <SectionHeader title="Body Parts" korean="Momtong" />
        <KoreanRow korean="Momtong" english="Body / Trunk" />
        <KoreanRow korean="Nopunde" english="High Section" />
        <KoreanRow korean="Najunde" english="Low Section" />
        <KoreanRow korean="Kaunde" english="Middle Section" />

        <View style={styles.spacer} />
        <KoreanRow korean="Joomuk" english="Fist" />
        <KoreanRow korean="Sonkal" english="Knife Hand" />
        <KoreanRow korean="Sonkal Dung" english="Reverse Knife Hand" />
        <KoreanRow korean="Sonbadak" english="Palm" />
        <KoreanRow korean="Palkup" english="Elbow" />
        <KoreanRow korean="Palmok" english="Forearm" />
        <KoreanRow korean="An Palmok" english="Inner Forearm" />
        <KoreanRow korean="Bakat Palmok" english="Outer Forearm" />

        <View style={styles.spacer} />
        <KoreanRow korean="Balkal" english="Foot Sword" />
        <KoreanRow korean="Baldung" english="Instep" />
        <KoreanRow korean="Balbadak" english="Sole" />
        <KoreanRow korean="Dwit Chook" english="Back Heel" />
        <KoreanRow korean="Ap Chook" english="Ball of Foot" />
        <KoreanRow korean="Murup" english="Knee" />

        <SectionHeader title="Patterns" korean="Tul" />
        <KoreanRow korean="Saju Jirugi" english="Four Direction Punch" />
        <KoreanRow korean="Saju Makgi" english="Four Direction Block" />
        <KoreanRow korean="Chon-Ji" english="Heaven and Earth" />
        <KoreanRow korean="Dan-Gun" english="Holy Dan-Gun" />
        <KoreanRow korean="Do-San" english="Patriot Ahn Chang-Ho" />
        <KoreanRow korean="Won-Hyo" english="Monk Won-Hyo" />
        <KoreanRow korean="Yul-Gok" english="Philosopher Yul-Gok" />
        <KoreanRow korean="Joong-Gun" english="Patriot Ahn Joong-Gun" />
        <KoreanRow korean="Toi-Gye" english="Scholar Toi-Gye" />
        <KoreanRow korean="Hwa-Rang" english="Hwa-Rang Youth Group" />
        <KoreanRow korean="Choong-Moo" english="Admiral Yi Soon-Sin" />

        <SectionHeader title="Ranks" korean="Gup / Dan" />
        <KoreanRow korean="Gup" english="Grade (below black belt)" />
        <KoreanRow korean="Dan" english="Degree (black belt)" />
        <KoreanRow korean="Boosabum" english="Assistant Instructor" />
        <KoreanRow korean="Sabum" english="Instructor" />
        <KoreanRow korean="Sahyun" english="Master" />
        <KoreanRow korean="Saseong" english="Grand Master" />

        <SectionHeader title="Commands" korean="Myryong" />
        <KoreanRow korean="Charyot" english="Attention" />
        <KoreanRow korean="Kyong-ye" english="Bow" />
        <KoreanRow korean="Junbi" english="Ready" />
        <KoreanRow korean="Si-jak" english="Start" />
        <KoreanRow korean="Guman" english="Stop" />
        <KoreanRow korean="Baro" english="Return to Ready" />
        <KoreanRow korean="Shio" english="Rest" />
        <KoreanRow korean="Hae San" english="Dismiss" />
        <KoreanRow korean="Dwiro Dora" english="About Turn" />
        <KoreanRow korean="Ap Ro Ga" english="Move Forward" />
        <KoreanRow korean="Baro Ga" english="Move Right" />
        <KoreanRow korean="Wen Ro Ga" english="Move Left" />
        <KoreanRow korean="Dwitro Ga" english="Move Backward" />
        <KoreanRow korean="Wen Bal Ap" english="Left Foot Forward" />
        <KoreanRow korean="Oren Bal Ap" english="Right Foot Forward" />

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f0f0f0' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  backBtn: { padding: 8 },
  scroll: { flex: 1, paddingHorizontal: 16 },
  sectionHeader: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  sectionHeaderText: {
    fontSize: 18,
    color: '#333',
  },
  green: {
    color: '#22c55e',
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  korean: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
  },
  english: {
    fontSize: 14,
    color: '#333',
    textAlign: 'right',
    flex: 1,
  },
  spacer: { height: 12 },
});

export default KoreanScreen;
