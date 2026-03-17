import React, { useState, useRef } from 'react';
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
} from 'react-native';
import { spacing } from '../../theme';
import Icon from '../../components/common/Icon';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const tenets = [
  {
    name: 'Courtesy',
    korean: 'ye ui',
    intro: 'Taekwon-Do students should attempt to practice the following elements of courtesy to build their noble character and to conduct training in an orderly manner as well.',
    points: [
      'To promote the spirit of mutual concessions.',
      "To be ashamed of one's vices and calling out those of others.",
      'To be polite to one another.',
      'To encourage the sense of justice and humanity.',
      'To distinguish instructor from student, senior from junior, and elder from younger.',
      "To behave one's self according to the proper etiquette.",
      "To respect others' possessions.",
      'To handle matters with fairness and sincerity.',
      'To refrain from giving or accepting any gift when in doubt.',
    ],
  },
  {
    name: 'Integrity',
    korean: 'yom chi',
    intro: 'In Taekwon-Do, the word integrity assumes a looser definition than the one usually found in a dictionary. One must be able to define right and wrong and have the conscience, if wrong, to feel guilt.',
    points: [
      'The instructor who misrepresents Taekwon-Do or who is unqualified to teach.',
      'The student who misrepresents his/her ability or knowledge.',
      'The student who gains rank for personal benefit.',
      'The student who attempts to bribe an instructor.',
      'The instructor who accepts a bribe.',
      'The student who cheats during training or testing.',
      'The student who does not report misconduct.',
      "The instructor who does not correct a student's mistakes.",
    ],
  },
  {
    name: 'Perseverance',
    korean: 'in nae',
    intro: 'There is an old Korean saying: "Patience leads to virtue or merit." One can make a peaceful home by being patient. Confucius said: "One who is impatient in trivial matters can seldom achieve success in matters of great importance."',
    points: [
      'To achieve a goal, whether it is a higher grade or mastering a technique.',
      'To train consistently even when progress seems slow.',
      'To overcome physical and mental challenges during training.',
      'To continue training through injury or hardship.',
      'To never give up on improving oneself.',
      'To maintain dedication to the art over many years.',
    ],
  },
  {
    name: 'Self-Control',
    korean: 'guk gi',
    intro: "This tenet is extremely important inside and outside the dojang, whether conducting oneself in free sparring or in one's personal affairs. A loss of self-control in free sparring can prove disastrous to both student and opponent.",
    points: [
      'To never use Taekwon-Do techniques in anger or aggression.',
      'To control the force of techniques during sparring.',
      'To maintain composure under pressure.',
      "To control one's emotions in difficult situations.",
      'To avoid reacting impulsively to provocation.',
      'To discipline oneself in daily life and training.',
      'To know when and when not to apply Taekwon-Do.',
    ],
  },
  {
    name: 'Indomitable Spirit',
    korean: 'baekjul boolgool',
    intro: 'A true Taekwon-Do student will never give up, even when faced with overwhelming odds. The spirit of Taekwon-Do is indomitable.',
    points: [
      'To show the courage to stand up for justice and what is right.',
      'To face any challenge with an unbreakable spirit.',
      "To never surrender one's principles under any circumstances.",
      'To fight for what is right even when outnumbered.',
      "To maintain one's beliefs in the face of adversity.",
      'To demonstrate bravery in the face of danger.',
      "To inspire others through one's own determination.",
    ],
  },
];

const TABS = ['Basic Theory', 'History'];

const HistoryContent = () => (
  <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
    <Text style={styles.pageTitle}>HISTORY</Text>

    <View style={styles.section}>
      <Text style={styles.sectionHeading}>Ancient Korea – Koguryo Kingdom (37 BC – 668 AD)</Text>
      <Text style={styles.sectionBody}>
        The earliest evidence of Korean martial arts dates back to the Koguryo Kingdom. Murals found in ancient tombs depict two men facing each other in fighting stances, indicating that unarmed combat was practised as early as 37 BC.
      </Text>
      <Text style={styles.sectionBody}>
        This early form of combat was known as Subak or Taekkyon. It was practised by warriors and commoners alike, and formed the foundation of what would eventually become Taekwon-Do.
      </Text>
    </View>

    <View style={styles.section}>
      <Text style={styles.sectionHeading}>Silla Kingdom & the Hwarang (57 BC – 935 AD)</Text>
      <Text style={styles.sectionBody}>
        The Silla Kingdom produced one of the most celebrated warrior groups in Korean history — the Hwarang. These young aristocratic warriors were trained in a wide range of skills including archery, horsemanship, sword fighting, and unarmed combat (Subak).
      </Text>
      <Text style={styles.sectionBody}>
        The Hwarang followed a strict code of conduct based on five principles: loyalty to the king, respect for parents, faithfulness to friends, no retreat in battle, and justice in killing. Their training and philosophy had a lasting influence on Korean martial arts.
      </Text>
      <Text style={styles.sectionBody}>
        The Hwarang were instrumental in unifying the Three Kingdoms of Korea (Koguryo, Paekche, and Silla) under Silla rule in 668 AD.
      </Text>
    </View>

    <View style={styles.section}>
      <Text style={styles.sectionHeading}>Koryo Dynasty (918 – 1392 AD)</Text>
      <Text style={styles.sectionBody}>
        During the Koryo Dynasty, Subak grew in popularity and became a more formalised system of combat. It was used as a method of selecting and training soldiers, and competitions were held regularly.
      </Text>
      <Text style={styles.sectionBody}>
        King Uijong (1147–1170) was particularly fond of Subak and encouraged its practice throughout the kingdom. It was during this period that Subak began to develop into a more structured martial art with defined techniques and training methods.
      </Text>
    </View>

    <View style={styles.section}>
      <Text style={styles.sectionHeading}>Yi (Joseon) Dynasty (1392 – 1910 AD)</Text>
      <Text style={styles.sectionBody}>
        The Yi Dynasty saw a shift in Korean society towards Confucian values, which placed less emphasis on military skills. As a result, the practice of Subak and Taekkyon declined among the upper classes, though it remained popular among ordinary people.
      </Text>
      <Text style={styles.sectionBody}>
        During this period, a manual called the "Muyedobotongji" was compiled, documenting various Korean martial arts techniques. Taekkyon was described as a kicking art that used the legs as the primary weapons.
      </Text>
      <Text style={styles.sectionBody}>
        By the late Yi Dynasty, Taekkyon had become a popular folk sport, practised at festivals and competitions throughout Korea.
      </Text>
    </View>

    <View style={styles.section}>
      <Text style={styles.sectionHeading}>Japanese Occupation (1910 – 1945)</Text>
      <Text style={styles.sectionBody}>
        When Japan annexed Korea in 1910, the practice of Korean martial arts was suppressed as part of a broader effort to eradicate Korean culture and identity. Public practice of Taekkyon was banned, and Korean martial artists were forced to practise in secret.
      </Text>
      <Text style={styles.sectionBody}>
        During this period, many Koreans were exposed to Japanese martial arts, particularly Shotokan Karate and Judo. Some Korean martial artists studied in Japan and earned black belts in these arts, later bringing their knowledge back to Korea.
      </Text>
      <Text style={styles.sectionBody}>
        Despite the suppression, Taekkyon survived through dedicated practitioners who kept the art alive in secret, passing it down to the next generation.
      </Text>
    </View>

    <View style={styles.section}>
      <Text style={styles.sectionHeading}>Post-Liberation & The Kwans (1945 – 1955)</Text>
      <Text style={styles.sectionBody}>
        After Korea's liberation from Japan in 1945, Korean martial artists began to openly teach their arts again. Several schools (kwans) were established, each with slightly different approaches:
      </Text>
      {[
        { name: 'Chung Do Kwan', year: '1944', founder: 'Won Kuk Lee' },
        { name: 'Moo Duk Kwan', year: '1945', founder: 'Hwang Kee' },
        { name: 'Yun Moo Kwan', year: '1945', founder: 'Chun Sang Sup' },
        { name: 'Chang Moo Kwan', year: '1946', founder: 'Byung Jick Ro' },
        { name: 'Oh Do Kwan', year: '1953', founder: 'Choi Hong Hi & Nam Tae Hi' },
      ].map((kwan) => (
        <View key={kwan.name} style={styles.kwanRow}>
          <Text style={styles.kwanName}>{kwan.name}</Text>
          <Text style={styles.kwanDetail}>Founded {kwan.year} by {kwan.founder}</Text>
        </View>
      ))}
      <Text style={[styles.sectionBody, { marginTop: spacing.md }]}>
        These kwans taught a mixture of Taekkyon, Subak, and Japanese Karate. The need to unify these different styles under one Korean martial art became increasingly apparent.
      </Text>
    </View>

    <View style={styles.section}>
      <Text style={styles.sectionHeading}>General Choi Hong Hi & Oh Do Kwan</Text>
      <Text style={styles.sectionBody}>
        General Choi Hong Hi (1918–2002) had studied Taekkyon as a child and later earned a 2nd Dan black belt in Shotokan Karate while studying in Japan. After joining the South Korean army, he began developing a new system of unarmed combat.
      </Text>
      <Text style={styles.sectionBody}>
        In 1953, General Choi established the Oh Do Kwan ("School of My Way") at the Kwang Ju military base. He taught his soldiers a system that combined the kicking techniques of Taekkyon with the hand techniques of Karate, enhanced by his own research into biomechanics and power generation.
      </Text>
    </View>

    <View style={styles.section}>
      <Text style={styles.sectionHeading}>Official Naming – 11th April 1955</Text>
      <Text style={styles.sectionBody}>
        On 11th April 1955, General Choi presented his new martial art to a board of historians, military leaders, and prominent citizens of Korea. After much deliberation, the name "Taekwon-Do" was officially adopted.
      </Text>
      <Text style={styles.sectionBody}>
        The name combined three Korean words: Tae (foot/kick), Kwon (fist/punch), and Do (art/way). This date is celebrated as the official birthday of Taekwon-Do, and 11th April is observed as Taekwon-Do Day by ITF practitioners worldwide.
      </Text>
    </View>

    <View style={styles.section}>
      <Text style={styles.sectionHeading}>Demonstration Teams & International Spread</Text>
      <Text style={styles.sectionBody}>
        From the late 1950s, General Choi organised demonstration teams to showcase Taekwon-Do internationally. These teams performed breathtaking displays of kicking, breaking, and patterns that amazed audiences around the world.
      </Text>
      <Text style={styles.sectionBody}>
        Korean military instructors were also deployed to Vietnam, Malaysia, and other countries, spreading Taekwon-Do as part of their military service. By the early 1960s, Taekwon-Do had been introduced to the United States, Canada, West Germany, Italy, Egypt, Turkey, Singapore, and many other nations.
      </Text>
    </View>

    <View style={styles.section}>
      <Text style={styles.sectionHeading}>ITF Founded – 22nd March 1966</Text>
      <Text style={styles.sectionBody}>
        On 22nd March 1966, General Choi founded the International Taekwon-Do Federation (ITF) in Seoul, South Korea. The ITF was established to promote, develop, and standardise Taekwon-Do worldwide under one governing body.
      </Text>
      <Text style={styles.sectionBody}>
        In 1972, due to political tensions with the South Korean government, General Choi relocated the ITF headquarters to Toronto, Canada. It was later moved to Vienna, Austria, where it remains today.
      </Text>
    </View>

    <View style={styles.section}>
      <Text style={styles.sectionHeading}>The Encyclopaedia of Taekwon-Do</Text>
      <Text style={styles.sectionBody}>
        General Choi dedicated much of his life to documenting Taekwon-Do in its entirety. The result was a monumental 15-volume encyclopaedia that covered every aspect of the art — its history, philosophy, tenets, patterns, techniques, sparring, and self-defence.
      </Text>
      <Text style={styles.sectionBody}>
        This encyclopaedia remains the definitive reference for ITF Taekwon-Do practitioners worldwide and is a testament to General Choi's lifelong dedication to the art.
      </Text>
    </View>

    <View style={styles.section}>
      <Text style={styles.sectionHeading}>WTF & Olympic Taekwondo (1973 – Present)</Text>
      <Text style={styles.sectionBody}>
        In 1973, the South Korean government established the World Taekwondo Federation (WTF), now known as World Taekwondo (WT). This organisation promoted a sport-oriented version that was included in the Olympic Games at Sydney 2000.
      </Text>
      <Text style={styles.sectionBody}>
        ITF Taekwon-Do and Olympic Taekwondo are distinct. ITF preserves the traditional art as developed by General Choi, with 24 patterns (tul), a comprehensive technique system, and a strong philosophical foundation.
      </Text>
    </View>

    <View style={styles.section}>
      <Text style={styles.sectionHeading}>Legacy</Text>
      <Text style={styles.sectionBody}>
        General Choi Hong Hi passed away on 15th June 2002 in Pyongyang, North Korea. He is remembered as the Father of Taekwon-Do. Today, Taekwon-Do is practised by millions of people in over 120 countries.
      </Text>
      <Text style={styles.sectionBody}>
        The ITF continues to promote General Choi's original vision — a martial art that develops not only physical ability but also character, discipline, and a philosophy of peace and self-improvement.
      </Text>
    </View>

    <View style={styles.bottomSpace} />
  </ScrollView>
);

const BasicTheoryScreen = ({ onBack }) => {
  const [showFounderDetail, setShowFounderDetail] = useState(false);
  const [selectedTenet, setSelectedTenet] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const scrollRef = useRef(null);

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
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <Icon name="arrow-back" size={24} color="#1f2937" type="MaterialIcons" />
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

            {/* What is Taekwon-Do */}
            <View style={styles.section}>
              <Text style={styles.sectionHeading}>What is Taekwon-Do?</Text>
              <Text style={styles.sectionBody}>
                Taekwon-Do is the art of self-defence founded by a Korean General named Choi Hong Hi. Taekwon-Do was officially recognized on 11th April 1955 when General Choi; after many years researching, developing and experimenting, proclaimed Taekwon-Do to the world as a completely unique martial art having a Korean origin.
              </Text>
            </View>

            {/* Etymology */}
            <View style={styles.section}>
              <Text style={styles.sectionHeading}>The Etymology of "Taekwon-Do"</Text>
              <Text style={styles.sectionBody}>
                The word "Taekwon-Do" comes from three separate terms, namely: Tae, Kwon, and Do.
              </Text>
              <Text style={styles.sectionBody}>
                Translated literally, "Tae" stands for jumping or flying, to kick or smash with the foot. "Kwon" denotes the fist – chiefly to punch or destroy with the hand or fist. "Do" means an art or way - the right way built and paved by the saints and sages of the previous generations.
              </Text>
            </View>

            {/* Tenets */}
            <View style={styles.section}>
              <Text style={styles.sectionHeading}>Tenets of Taekwon-Do</Text>
              {tenets.map((tenet) => (
                <TouchableOpacity
                  key={tenet.name}
                  style={styles.tenetRow}
                  onPress={() => setSelectedTenet(tenet)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.tenet}>• {tenet.name}</Text>
                  <Text style={styles.tenetKorean}>({tenet.korean})</Text>
                  <Icon name="chevron-right" size={18} color="#9ca3af" type="MaterialIcons" />
                </TouchableOpacity>
              ))}
            </View>

            {/* Student Oath */}
            <View style={styles.section}>
              <Text style={styles.sectionHeading}>Student Oath</Text>
              <Text style={styles.sectionBody}>
                I shall observe the tenets of Taekwon-Do.{'\n'}
                I shall respect the instructor and seniors.{'\n'}
                I shall never misuse Taekwon-Do.{'\n'}
                I shall be a champion of freedom and justice.{'\n'}
                I shall build a more peaceful world.
              </Text>
            </View>

            {/* Founder Card */}
            <View style={styles.founderCard}>
              <View style={styles.founderLeft}>
                <Text style={styles.founderName}>General{'\n'}Choi{'\n'}Hong Hi{'\n'}IX Degree</Text>
                <TouchableOpacity
                  style={styles.readMoreButton}
                  onPress={() => setShowFounderDetail(true)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.readMoreText}>READ{'\n'}MORE</Text>
                </TouchableOpacity>
              </View>
              <Image
                source={require('../../assets/choi-hong-hi.jpg')}
                style={styles.founderImage}
                resizeMode="cover"
              />
            </View>

            {/* Dobok / Tree Symbol */}
            <View style={styles.dobokSection}>
              <Text style={styles.dobokText}>
                The shape of a tree is on the back of your dobok. The word Taekwon-Do is written in Korean like the trunk of a tree and in English as like the canopy of the tree. The tree symbolises a long life.
              </Text>
              <View style={styles.dobokLogoContainer}>
                <Text style={styles.dobokLogo}>태{'\n'}권{'\n'}도</Text>
                <Text style={styles.dobokLogoEn}>TAEKWON-DO</Text>
              </View>
            </View>

            {/* Theory of Power */}
            <View style={styles.section}>
              <Text style={styles.sectionHeading}>Theory of Power</Text>
              {[
                { term: 'Reaction Force', korean: 'Bandong Ryok', desc: 'Every technique requires a reactive force. A punch with the right fist is aided by pulling back the left fist to the hip simultaneously.' },
                { term: 'Concentration', korean: 'Jip Joong', desc: "Concentrating all the body's power to the attacking tool at the moment of impact." },
                { term: 'Equilibrium', korean: 'Kyun Hyung', desc: 'Maintaining correct balance throughout all movements and techniques.' },
                { term: 'Breath Control', korean: 'Ho Hup', desc: 'Exhaling sharply at the moment of impact to increase power and tighten the muscles.' },
                { term: 'Speed', korean: 'Sok Do', desc: 'The faster the technique, the greater the force generated at the point of impact.' },
                { term: 'Mass', korean: 'Zilyang', desc: "Using the body's full mass by rotating the hip and shifting body weight into the technique." },
              ].map((item) => (
                <View key={item.term} style={styles.powerItem}>
                  <View style={styles.powerHeader}>
                    <Text style={styles.powerTermBold}>{item.term} </Text>
                    <Text style={styles.powerTermKorean}>({item.korean})</Text>
                  </View>
                  <Text style={styles.powerDesc}>{item.desc}</Text>
                </View>
              ))}
            </View>

    

            <View style={styles.bottomSpace} />
          </ScrollView>
        </View>

        {/* Page 2: History */}
        <View style={{ width: SCREEN_WIDTH, flex: 1 }}>
          <HistoryContent />
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
                <Icon name="close" size={24} color="#1f2937" type="MaterialIcons" />
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
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowFounderDetail(false)} activeOpacity={0.7}>
              <Icon name="arrow-back" size={24} color="#1f2937" type="MaterialIcons" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>General Choi Hong Hi</Text>
            <View style={{ width: 24 }} />
          </View>
          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            <Image
              source={require('../../assets/choi-hong-hi.jpg')}
              style={styles.modalImage}
              resizeMode="cover"
            />
            <Text style={styles.modalName}>General Choi Hong Hi{'\n'}IX Degree Black Belt</Text>
            <Text style={styles.modalDate}>9th November 1918 – 15th June 2002</Text>
            <Text style={styles.modalSectionTitle}>Early Life</Text>
            <Text style={styles.modalText}>
              Choi Hong Hi was born on 9th November 1918 in Hwa Dae, Myongchon county, in what is now North Korea. As a child he was frail and sickly, and his father sent him to study calligraphy under Han Il Dong, who also taught him Taek Kyon, a traditional Korean martial art.
            </Text>
            <Text style={styles.modalSectionTitle}>Military Career</Text>
            <Text style={styles.modalText}>
              Choi studied in Japan and earned a black belt in Shotokan karate. After Korea's liberation from Japan in 1945, he joined the newly formed South Korean army. He rose to the rank of General and used his military position to develop and spread Taekwon-Do among Korean soldiers.
            </Text>
            <Text style={styles.modalSectionTitle}>Founding Taekwon-Do</Text>
            <Text style={styles.modalText}>
              On 11th April 1955, General Choi officially named the martial art "Taekwon-Do" before a board of historians and military leaders. He spent years researching, developing and experimenting to create a completely unique martial art with Korean origins.
            </Text>
            <Text style={styles.modalSectionTitle}>ITF Foundation</Text>
            <Text style={styles.modalText}>
              On 22nd March 1966, General Choi founded the International Taekwon-Do Federation (ITF) in Seoul, South Korea. He served as its president and dedicated his life to spreading Taekwon-Do across the world, visiting over 50 countries to promote the art.
            </Text>
            <Text style={styles.modalSectionTitle}>Legacy</Text>
            <Text style={styles.modalText}>
              General Choi Hong Hi passed away on 15th June 2002 in Pyongyang, North Korea. He is remembered as the Father of Taekwon-Do. His life's work created one of the world's most widely practiced martial arts, with millions of practitioners in over 120 countries.
            </Text>
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
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
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
    borderBottomColor: '#16a34a',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#9ca3af',
  },
  tabTextActive: {
    color: '#16a34a',
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
  section: { marginBottom: spacing.xl },
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
    borderColor: '#16a34a',
    borderRadius: 12,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignSelf: 'flex-start',
  },
  readMoreText: {
    color: '#16a34a',
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
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#1f2937' },
  modalBody: { flex: 1, paddingHorizontal: spacing.md },
  modalImage: {
    width: '100%',
    height: 280,
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
  modalText: { fontSize: 15, color: '#374151', lineHeight: 24, marginBottom: spacing.md },
});

export default BasicTheoryScreen;
