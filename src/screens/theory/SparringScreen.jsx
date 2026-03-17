import React, { useState } from 'react';
import { View, Text, SafeAreaView, StatusBar, TouchableOpacity, ScrollView, StyleSheet, Dimensions, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SparringScreen = ({ sparring, onBack }) => {
  const [expandedRoutine, setExpandedRoutine] = useState(null);

  const getSparringDetails = (sparringType) => {
    const type = sparringType.toLowerCase().trim();
    
    const details = {
      '3-step': {
        title: '3-STEP',
        whatIs: 'Three step (Sambo Matsogi) is an exercise for familiarization of correct attack and defense techniques utilizing mainly the hand parts against middle and high targets and the foot parts against low targets while stepping forward and backwards.',
        attacking: {
          intro: 'The attack in 3 step always starts from a left Walking Stance while executing a low block with the left forearm.',
          attacks: [
            { num: 'i.', text: 'On commencement the attacker moves forward into a right Walking Stance while executing a front punch with their right fist.' },
            { num: 'ii.', text: 'Next the attacker moves forward into a left Walking Stance while executing a front punch with their left fist.' },
            { num: 'iii.', text: 'The last attack is the same as i, moving forward, right Walking Stance executing right punch.' }
          ]
        },
        defending: 'The defence in 3 step always starts from Parallel Ready Stance. Throughout the 9 routines, the defence techniques differ. Each defence ends with a counter-attack.',
        routines: [
          {
            num: 1,
            title: 'Right foot back',
            details: [
              'i. Left Walking Stance, left inner forearm middle block.',
              'ii. Right Walking Stance, right inner forearm middle block.',
              'iii. Left Walking Stance, left inner forearm middle block.',
              'Maintaining a left Walking Stance, right middle reverse punch.'
            ]
          },
          {
            num: 2,
            title: 'Left foot back',
            details: [
              'i. Right Walking Stance, right inner forearm middle block.',
              'ii. Left Walking Stance, left inner forearm middle block.',
              'iii. Right Walking Stance, right inner forearm middle block.',
              'Maintaining a right Walking Stance, left middle reverse punch.'
            ]
          },
          {
            num: 3,
            title: 'Right foot forward',
            details: [
              'i. Left Walking Stance, left outer forearm low block.',
              'ii. Right Walking Stance, right outer forearm low block.',
              'iii. Left Walking Stance, left outer forearm low block.',
              'Maintaining a left Walking Stance, right middle punch.'
            ]
          },
          {
            num: 4,
            title: 'Left foot forward',
            details: [
              'i. Right Walking Stance, right outer forearm low block.',
              'ii. Left Walking Stance, left outer forearm low block.',
              'iii. Right Walking Stance, right outer forearm low block.',
              'Maintaining a right Walking Stance, left middle punch.'
            ]
          }
        ]
      },
      '2-step': {
        title: '2-STEP',
        whatIs: 'Two step (Ee-Soo Matsogi) is an exercise for familiarization of correct attack and defense techniques. The attacker executes two consecutive attacks while the defender blocks and counters each attack.',
        attacking: {
          intro: 'The attack in 2 step always starts from a left Walking Stance while executing a low block with the left forearm.',
          attacks: [
            { num: 'i.', text: 'On commencement the attacker moves forward into a right Walking Stance while executing a front punch with their right fist.' },
            { num: 'ii.', text: 'Next the attacker moves forward into a left Walking Stance while executing a front punch with their left fist.' }
          ]
        },
        defending: 'The defence in 2 step always starts from Parallel Ready Stance. The defence techniques differ throughout the routines. Each defence ends with a counter-attack.',
        routines: [
          {
            num: 1,
            title: 'Right foot back',
            details: [
              'i. Left Walking Stance, left inner forearm middle block.',
              'ii. Right Walking Stance, right inner forearm middle block.',
              'Maintaining a left Walking Stance, right middle reverse punch.'
            ]
          },
          {
            num: 2,
            title: 'Left foot back',
            details: [
              'i. Right Walking Stance, right inner forearm middle block.',
              'ii. Left Walking Stance, left inner forearm middle block.',
              'Maintaining a right Walking Stance, left middle reverse punch.'
            ]
          },
          {
            num: 3,
            title: 'Right foot forward',
            details: [
              'i. Left Walking Stance, left outer forearm low block.',
              'ii. Right Walking Stance, right outer forearm low block.',
              'Maintaining a left Walking Stance, right middle punch.'
            ]
          }
        ]
      },
      '1-step': {
        title: '1-STEP',
        whatIs: 'One step (Il-Soo Matsogi) focuses on defending and counterattacking single punches in a walking stance. It starts from a parallel ready stance, with attacks initiated from both right and left sides.',
        attacking: {
          intro: 'The attacker executes a single punch from a Walking Stance.',
          attacks: [
            { num: 'i.', text: 'Attacker moves forward into a right Walking Stance while executing a front punch with their right fist.' }
          ]
        },
        defending: 'Defenders use blocking or evading techniques and respond with combinations of strikes or take-downs. Correct technique, targeting distance, and control are crucial.',
        routines: [
          {
            num: 1,
            title: 'Right foot back',
            details: [
              'Left Walking Stance, left inner forearm middle block.',
              'Maintaining a left Walking Stance, right middle reverse punch.'
            ]
          },
          {
            num: 2,
            title: 'Left foot back',
            details: [
              'Right Walking Stance, right inner forearm middle block.',
              'Maintaining a right Walking Stance, left middle reverse punch.'
            ]
          }
        ]
      },
      'free': {
        title: 'FREE SPARRING',
        whatIs: 'Free Sparring (Jayu Matsogi) is open combat with controlled attacking and prohibition of attacking to certain vital spots. In free sparring there is no prearranged mode between the practitioners, with both participants are completely free to attack and defend with all available means and methods.',
        attacking: {
          intro: 'Both participants attack and defend freely.',
          attacks: [
            { num: 'i.', text: 'Participants use various techniques including punches, kicks, and combinations.' }
          ]
        },
        defending: 'Both participants defend and counterattack freely with emphasis on control and technique.',
        sections: [
          {
            title: 'This app covers ITF Sparring Rules',
            content: ''
          },
          {
            title: 'Structure of Sparring:',
            points: [
              'Most points wins the round.',
              'Single Elimination. You must win all your bouts.',
              '2 rounds of 2 minutes.',
              'In the event of a draw: 1 round of 1 minute.',
              'In the event of a second draw: First score wins with no time limit.'
            ]
          },
          {
            title: 'Layout of Sparring:',
            points: [
              '10x10 meter square arena.',
              '4 corner Umpires (U) for score keeping.',
              'Top table (T) hosts the Jury President which is the administrator for the ring.',
              'Centre Referee (R) is the spokesperson and directs the competitors.',
              'Red (Hong) is on the right.',
              'Blue (Chong) is on the left.'
            ]
          },
          {
            title: 'Points Scoring:',
            points: [
              'One point awarded for any hand attack to mid or high section.',
              'Two points awarded for any foot attack to mid section.',
              'Three points awarded for any foot attack to high section'
            ]
          },
          {
            title: 'Warnings:',
            points: [
              'Pretending to have scored a point.',
              'Stepping completely out of the ring.',
              'Falling down, regardless of how the fall happened.',
              'Faking an injury, to waste time or fool the opponent.',
              'Avoiding sparring.'
            ]
          },
          {
            title: 'Fouls:',
            points: [
              'Heavy contact, excessive hard contact will lead to a foul.',
              'Attacking an opponent on the ground.',
              'Leg sweeping or any attempt to take the opponent to the ground. Knocking the opponent over does not apply.',
              'Holding or clinching.',
              'Avoiding sparring, running away or facing away from the opponent.',
              'Attack to an illegal target. Low section or back.',
              'Pushing with hands, body or shoulders.',
              'Grabbing of any kind, including unintentional.',
              'Intentional attack to an illegal target. Low section or back.'
            ]
          },
          {
            title: 'Reasons for Disqualifications:',
            points: [
              'Misconduct against officials.',
              'Uncontrolled and excessive contact.',
              'Receive three fouls from the centre referee.',
              'Being under the influence; including enhancement drugs.',
              'Loss of temper or self-control.',
              'Disrespect to opponent, coach or official.',
              'Use of illegal attacking tools; teeth, nails, knee, elbow or head.',
              'Causing a knockout; excessive contact.'
            ]
          }
        ],
        routines: []
      },
      'free sparring': {
        title: 'FREE SPARRING',
        whatIs: 'Free Sparring (Jayu Matsogi) is open combat with controlled attacking and prohibition of attacking to certain vital spots. In free sparring there is no prearranged mode between the practitioners, with both participants are completely free to attack and defend with all available means and methods.',
        attacking: {
          intro: 'Both participants attack and defend freely.',
          attacks: [
            { num: 'i.', text: 'Participants use various techniques including punches, kicks, and combinations.' }
          ]
        },
        defending: 'Both participants defend and counterattack freely with emphasis on control and technique.',
        sections: [
          {
            title: 'This app covers ITF Sparring Rules',
            content: ''
          },
          {
            title: 'Structure of Sparring:',
            points: [
              'Most points wins the round.',
              'Single Elimination. You must win all your bouts.',
              '2 rounds of 2 minutes.',
              'In the event of a draw: 1 round of 1 minute.',
              'In the event of a second draw: First score wins with no time limit.'
            ]
          },
          {
            title: 'Layout of Sparring:',
            points: [
              '10x10 meter square arena.',
              '4 corner Umpires (U) for score keeping.',
              'Top table (T) hosts the Jury President which is the administrator for the ring.',
              'Centre Referee (R) is the spokesperson and directs the competitors.',
              'Red (Hong) is on the right.',
              'Blue (Chong) is on the left.'
            ]
          },
          {
            title: 'Points Scoring:',
            points: [
              'One point awarded for any hand attack to mid or high section.',
              'Two points awarded for any foot attack to mid section.',
              'Three points awarded for any foot attack to high section'
            ]
          },
          {
            title: 'Warnings:',
            points: [
              'Pretending to have scored a point.',
              'Stepping completely out of the ring.',
              'Falling down, regardless of how the fall happened.',
              'Faking an injury, to waste time or fool the opponent.',
              'Avoiding sparring.'
            ]
          },
          {
            title: 'Fouls:',
            points: [
              'Heavy contact, excessive hard contact will lead to a foul.',
              'Attacking an opponent on the ground.',
              'Leg sweeping or any attempt to take the opponent to the ground. Knocking the opponent over does not apply.',
              'Holding or clinching.',
              'Avoiding sparring, running away or facing away from the opponent.',
              'Attack to an illegal target. Low section or back.',
              'Pushing with hands, body or shoulders.',
              'Grabbing of any kind, including unintentional.',
              'Intentional attack to an illegal target. Low section or back.'
            ]
          },
          {
            title: 'Reasons for Disqualifications:',
            points: [
              'Misconduct against officials.',
              'Uncontrolled and excessive contact.',
              'Receive three fouls from the centre referee.',
              'Being under the influence; including enhancement drugs.',
              'Loss of temper or self-control.',
              'Disrespect to opponent, coach or official.',
              'Use of illegal attacking tools; teeth, nails, knee, elbow or head.',
              'Causing a knockout; excessive contact.'
            ]
          }
        ],
        routines: []
      }
    };

    return details[type] || details['3-step'];
  };

  const sparringDetails = getSparringDetails(sparring);

  const toggleRoutine = (routineNum) => {
    setExpandedRoutine(expandedRoutine === routineNum ? null : routineNum);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color="#fff" type="MaterialIcons" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{sparringDetails.title}</Text>
        <View style={{ width: 32 }} />
      </View>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What is {sparringDetails.title.toLowerCase()}?</Text>
          <Text style={styles.bodyText}>
            <Text style={styles.highlight}>{sparringDetails.title.split(' ')[0]}</Text>
            {' ' + sparringDetails.whatIs.substring(sparringDetails.title.split(' ')[0].length)}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Attacking</Text>
          <Text style={styles.bodyText}>{sparringDetails.attacking.intro}</Text>
          {sparringDetails.attacking.attacks.map((attack, i) => (
            <Text key={i} style={styles.bodyText}>
              <Text style={styles.bold}>{attack.num}</Text> {attack.text}
            </Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Defending</Text>
          <Text style={styles.bodyText}>{sparringDetails.defending}</Text>
        </View>

        {sparringDetails.sections && sparringDetails.sections.length > 0 && (
          <View>
            {sparringDetails.sections.map((section, idx) => (
              <View key={idx} style={styles.section}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                {section.content && <Text style={styles.bodyText}>{section.content}</Text>}
                {section.points && section.points.map((point, i) => (
                  <Text key={i} style={styles.bulletPoint}>
                    • {point}
                  </Text>
                ))}
                {section.title === 'Layout of Sparring:' && (
                  <View style={styles.arenaContainer}>
                    <View style={styles.tableTop}>
                      <Text style={styles.tableLabel}>T</Text>
                    </View>
                    <View style={styles.arenaFullWrapper}>
                      <View style={styles.topUmpires}>
                        <Text style={styles.umpireLabel}>U</Text>
                        <View style={{ flex: 1 }} />
                        <Text style={styles.umpireLabel}>U</Text>
                      </View>
                      <View style={styles.arenaWrapper}>
                        <View style={styles.umpireLeft}>
                          <Text style={styles.umpireLabel}>U</Text>
                        </View>
                        <View style={styles.arena}>
                          <View style={styles.arenaInner}>
                            <Text style={styles.chong}>CHONG</Text>
                            <Text style={styles.referee}>R</Text>
                            <Text style={styles.hong}>HONG</Text>
                          </View>
                        </View>
                        <View style={styles.umpireRight}>
                          <Text style={styles.umpireLabel}>U</Text>
                        </View>
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
                )}
                {section.title === 'Points Scoring:' && (
                  <View>
                    <Image
                      source={require('../../assets/img1.png')}
                      style={styles.scoringImage}
                      resizeMode="contain"
                    />
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {sparringDetails.routines.length > 0 && (
          <View>
            {sparringDetails.routines.map((routine) => (
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
                    <Text style={styles.routineTitle}>{routine.title}</Text>
                    {routine.details.map((detail, i) => (
                      <Text key={i} style={styles.detailText}>{detail}</Text>
                    ))}
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
  backBtn: {
    padding: 8,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
    paddingVertical: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
    paddingBottom: 0,
    borderBottomWidth: 0,
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333',
    marginBottom: 8,
  },
  highlight: {
    color: '#006CB5',
    fontWeight: 'bold',
  },
  bold: {
    fontWeight: 'bold',
    color: '#006CB5',
  },
  routineContainer: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 0,
  },
  routineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  routineNum: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  readMoreBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#006CB5',
  },
  readMoreText: {
    color: '#006CB5',
    fontWeight: 'bold',
    fontSize: 12,
  },
  routineDetails: {
    paddingVertical: 12,
    paddingHorizontal: 0,
  },
  routineTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#333',
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333',
    marginBottom: 8,
  },
  arenaContainer: {
    marginTop: 20,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  tableTop: {
    width: 120,
    height: 20,
    backgroundColor: '#000',
    marginBottom: 12,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableLabel: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  arenaFullWrapper: {
    alignItems: 'center',
  },
  topUmpires: {
    flexDirection: 'row',
    width: 240,
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  arenaWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  umpireLeft: {
    width: 30,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  umpireRight: {
    width: 30,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  bottomUmpires: {
    flexDirection: 'row',
    width: 240,
    justifyContent: 'space-between',
  },
  umpireLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  arena: {
    width: 200,
    height: 200,
    backgroundColor: '#22c55e',
    borderWidth: 0,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arenaInner: {
    width: '90%',
    height: '90%',
    backgroundColor: '#4ade80',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  chong: {
    position: 'absolute',
    left: 10,
    top: '50%',
    transform: [{ translateY: -12 }],
    fontSize: 16,
    fontWeight: 'bold',
    color: '#006CB5',
  },
  hong: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -12 }],
    fontSize: 16,
    fontWeight: 'bold',
    color: '#dc2626',
  },
  referee: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  dimensionLabels: {
    marginTop: 8,
    alignItems: 'center',
  },
  dimensionLabel: {
    fontSize: 12,
    color: '#666',
  },
  scoringDiagram: {
    flexDirection: 'row',
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  scoringImage: {
    width: '100%',
    height: 400,
    marginTop: 16,
    marginBottom: 16,
  },
  scoringLeft: {
    flex: 1,
    justifyContent: 'space-around',
    paddingRight: 16,
    borderRightWidth: 3,
    borderRightColor: '#000',
  },
  scoringItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  scoringIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  scoringText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  prohibitedItem: {
    alignItems: 'center',
    marginVertical: 8,
  },
  prohibitedIcon: {
    fontSize: 28,
  },
  bodyFigure: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 16,
  },
  head: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fef3c7',
    borderWidth: 2,
    borderColor: '#000',
    marginBottom: 8,
  },
  body: {
    width: 50,
    height: 60,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#000',
    marginBottom: 8,
  },
  arms: {
    flexDirection: 'row',
    width: 80,
    height: 30,
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  legs: {
    flexDirection: 'row',
    width: 50,
    height: 50,
    justifyContent: 'space-between',
  },
});

export default SparringScreen;
