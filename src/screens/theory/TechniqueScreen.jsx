import React from 'react';
import { View, Text, SafeAreaView, StatusBar, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const TechniqueScreen = ({ onBack }) => {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>TECHNIQUE</Text>
        <View style={{ width: 32 }} />
      </View>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Sine Wave</Text>
        <Text style={styles.bodyText}>
          The basics of sine wave are down-up-down, in other words there is always a downward motion first, followed by an upward motion, and ending in a downward motion when the technique is executed.
        </Text>

        <Text style={styles.bodyText}>
          <Text style={styles.bold}>A: DOWN </Text>
          Both knees bend as the transition to next move begins.{'\n'}
          <Text style={styles.bold}>B: UP </Text>
          Both feet come together. The person reaches the maximum height. The knees never fully lengthen and the feet do not touch.{'\n'}
          <Text style={styles.bold}>C: DOWN </Text>
          The body drops into the final stance. The technique finishes with the stance.
        </Text>

        <Text style={styles.bodyText}>
          There are variations with sine wave in different motions, listed below.
        </Text>

        <Image
          source={require('../../assets/img2.png')}
          style={styles.image}
          resizeMode="contain"
        />

        <View style={styles.motionSection}>
          <Text style={styles.motionTitle}>Normal Motion <Text style={styles.motionCode}>(1-1-1)</Text></Text>
          <Text style={styles.bodyText}>
            Majority of moves in Taekwon-Do are a Normal Motion with 1 movement, 1 sine wave and 1 breath. All movements in <Text style={styles.red}>Saju Jirugi</Text>, <Text style={styles.red}>Saju Makgi</Text> and <Text style={styles.red}>Chon-Ji Tul</Text> are Normal Motions.
          </Text>
        </View>

        <View style={styles.motionSection}>
          <Text style={styles.motionTitle}>Continuous Motion <Text style={styles.motionCode}>(2-2-1)</Text></Text>
          <Text style={styles.bodyText}>
            A Continuous Motion is 2 movements performed consecutively, 2 movements, 2 sine waves and 1 breath. Movements 13 and 14 in <Text style={styles.red}>Dan-Gun Tul</Text> are Continuous Motions.
          </Text>
        </View>

        <View style={styles.motionSection}>
          <Text style={styles.motionTitle}>Fast Motion <Text style={styles.motionCode}>(2-1½-2)</Text></Text>
          <Text style={styles.bodyText}>
            A Fast Motion has 2 movements, 1½ sine waves and 2 breaths. The sine wave is down-up-down-up-down, there is no pause between movements. Movements 15 & 16 and 19 & 20 in <Text style={styles.red}>Do-San Tul</Text> are Fast Motions.
          </Text>
        </View>

        <View style={styles.motionSection}>
          <Text style={styles.motionTitle}>Connecting Motion <Text style={styles.motionCode}>(2-1-1)</Text></Text>
          <Text style={styles.bodyText}>
            A Connecting Motion is when 2 movements are executed in 1 sine wave, there is no pause between movements. There is 2 movements, 1 sine wave and 1 elongated breath. Movements 16 & 17 and 19 & 20 in <Text style={styles.red}>Yul-Gok Tul</Text> are Connecting Motions.
          </Text>
        </View>

        <View style={styles.motionSection}>
          <Text style={styles.motionTitle}>Slow Motion <Text style={styles.motionCode}>(1-1-1)</Text></Text>
          <Text style={styles.bodyText}>
            A Slow Motion is the same as a Normal Motion but performed slowly, there is no power or acceleration. Slow motion is designed to display balance and timing. Movements 27, 29 and 30 in <Text style={styles.red}>Joong-Gun Tul</Text> are Slow Motions.
          </Text>
        </View>

        <View style={styles.motionSection}>
          <Text style={styles.bodyText}>
            <Text style={styles.bold}>There is also 3 other movements that are not motions:</Text>
          </Text>
        </View>

        <View style={styles.motionSection}>
          <Text style={styles.motionTitle}>Natural Movement</Text>
          <Text style={styles.bodyText}>
            Natural Movements are the same as Normal Motions but do not have a snap or abrupt finish. Movements 15 & 18 in <Text style={styles.red}>Yul-Gok Tul</Text> are Natural Movements.
          </Text>
        </View>

        <View style={styles.motionSection}>
          <Text style={styles.motionTitle}>Stamping Movement</Text>
          <Text style={styles.bodyText}>
            Stamping Movements are used to emphasise power, the side sole or under the balkal is used for stamping. Movements 13 - 18 in <Text style={styles.red}>Toi-Gye Tul</Text> are Stamping Movements.
          </Text>
        </View>

        <View style={styles.motionSection}>
          <Text style={styles.motionTitle}>Releasing Movement</Text>
          <Text style={styles.bodyText}>
            Releasing Movements are done to simulate releasing from a grab. The grabbed body part is rotated with 1 sine wave and usually followed with an attack. Movements 15 and 18 in <Text style={styles.red}>Joong-Gun Tul</Text> are Releasing Movements.
          </Text>
        </View>

        <View style={styles.motionSection}>
          <Text style={styles.bodyText}>
            <Text style={styles.bold}>There are five alternative ways to transition into another stance aside from direct movement:</Text>
          </Text>
        </View>

        <View style={styles.motionSection}>
          <Text style={styles.motionTitle}>Step Turning</Text>
          <Text style={styles.bodyText}>
            To Step Turn (1.) the front foot (A) crosses the centre line. Twist the front foot (A) 90° inwards while stepping on the ball of the foot. (2.) The rear foot (B) crosses over the centre line and twists 90° landing on the ball of the foot and then (3.) pivot both feet another 90° twisting into the next stance.
          </Text>
          <Text style={styles.bodyText}>
            The next technique should finish when both feet are fully placed. Step-turning is used to turn to face an opponent in any direction. In <Text style={styles.red}>Do-San Tul</Text> the transition from Movements from 2 to 3 is a Step Turn.
          </Text>

          {/* Step Turn Diagram */}
          <View style={styles.diagramContainer}>
            {/* Left panel - Step 1 & 2 */}
            <View style={styles.diagramPanel}>
              {/* Step 1 - Foot A left side */}
              <View style={styles.footRowTop}>
                <View style={styles.footLeft}>
                  <Text style={styles.stepNum}>1.</Text>
                  <View style={styles.footShape}>
                    <Text style={styles.footLabel}>A</Text>
                  </View>
                </View>
                {/* Red centre line */}
                <View style={styles.centreLine} />
                {/* Foot A right side */}
                <View style={styles.footRight}>
                  <View style={styles.footShapeTall}>
                    <Text style={styles.footLabel}>A</Text>
                  </View>
                </View>
              </View>
              {/* Step 2 - Foot B */}
              <View style={styles.footRowBottom}>
                <View style={styles.footLeft}>
                  <View style={styles.footShapeLarge}>
                    <Text style={styles.footLabel}>B</Text>
                  </View>
                </View>
                <View style={styles.centreLine} />
                <View style={styles.footRight}>
                  <Text style={styles.stepNum}>2.</Text>
                  <View style={styles.footShapeSmall}>
                    <Text style={styles.footLabel}>B</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={{ width: 16 }} />

            {/* Right panel - Step 3 */}
            <View style={styles.diagramPanel}>
              {/* Step 3 - Foot A rotated */}
              <View style={styles.footRowTop}>
                <View style={styles.footLeft}>
                  <Text style={styles.stepNum}>3.</Text>
                  <View style={[styles.footShapeTall, { transform: [{ rotate: '180deg' }] }]}>
                    <Text style={[styles.footLabel, { transform: [{ rotate: '180deg' }] }]}>A</Text>
                  </View>
                  <Text style={styles.arrow}>↻</Text>
                </View>
                <View style={styles.centreLine} />
                <View style={styles.footRight} />
              </View>
              {/* Step 3 - Foot B rotated */}
              <View style={styles.footRowBottom}>
                <View style={styles.footLeft} />
                <View style={styles.centreLine} />
                <View style={styles.footRight}>
                  <Text style={styles.stepNum}>3.</Text>
                  <View style={[styles.footShapeLarge, { transform: [{ rotate: '180deg' }] }]}>
                    <Text style={[styles.footLabel, { transform: [{ rotate: '180deg' }] }]}>B</Text>
                  </View>
                  <Text style={styles.arrow}>↺</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.motionSection}>
          <Text style={styles.motionTitle}>Slipping the Foot</Text>
          <Text style={styles.bodyText}>
            To Slip the Foot is to transition from a shorter stance to a longer stance. Usually done alongside Slow Motions, the weight is placed on the stationary foot and the moving foot glides along the ground into the next stance. The Movements 8 and 10 in <Text style={styles.red}>Joong-Gun Tul</Text> are Slipped from <Text style={styles.blue}>L-Stance</Text> to <Text style={styles.blue}>Walking Stance</Text>.
          </Text>
        </View>

        <View style={styles.motionSection}>
          <Text style={styles.motionTitle}>Sliding</Text>
          <Text style={styles.bodyText}>
            Sliding used to change stance and also gain distance. The front foot lifts and moves back half a shoulder width, using the rear foot slide forwards half a shoulder width into the next stance. Plant the front foot to finish the slide executing the next technique. In <Text style={styles.red}>Hwa-Rang Tul</Text> the transition from Movements from 5 to 6 is a Slide.
          </Text>
        </View>

        <View style={styles.motionSection}>
          <Text style={styles.motionTitle}>Pulling the Foot</Text>
          <Text style={styles.bodyText}>
            Pulling the Foot is the opposite to Slipping the Foot, it is to transition from a longer stance to a shorter stance. Similarly to Slipping the Foot, the weight is placed on the stationary foot and the moving foot glides along the ground into the next stance. The Movements 6 & 7 and 11 & 12 in <Text style={styles.red}>Hwa-Rang Tul</Text> are Pulled.
          </Text>
        </View>

        <View style={styles.motionSection}>
          <Text style={styles.motionTitle}>Double Stepping</Text>
          <Text style={styles.bodyText}>
            Double Stepping is done to cover move distance, both steps with full sine wave. Movements 4 and 6 in <Text style={styles.red}>Kwang-Gae Tul</Text> are Double Stepping Motion.
          </Text>
        </View>

        <View style={{ height: 50 }} />
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
  scroll: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333',
    marginBottom: 4,
  },
  bold: {
    fontWeight: 'bold',
    color: '#000',
  },
  image: {
    width: '100%',
    height: 200,
    marginTop: 0,
  },
  motionSection: {
    marginTop: 16,
  },
  motionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 6,
  },
  motionCode: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#333',
  },
  red: {
    color: '#dc2626',
    fontWeight: 'bold',
  },
  blue: {
    color: '#006CB5',
    fontWeight: 'bold',
  },
  diagramContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 8,
  },
  diagramPanel: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    overflow: 'hidden',
    minHeight: 280,
  },
  footRowTop: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  footRowBottom: {
    flex: 1,
    flexDirection: 'row',
  },
  footLeft: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  footRight: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  centreLine: {
    width: 3,
    backgroundColor: '#dc2626',
  },
  footShape: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footShapeTall: {
    width: 36,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footShapeLarge: {
    width: 44,
    height: 60,
    borderRadius: 22,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footShapeSmall: {
    width: 36,
    height: 44,
    borderRadius: 18,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footLabel: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  stepNum: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  arrow: {
    fontSize: 18,
    color: '#555',
    marginTop: 4,
  },
});

export default TechniqueScreen;
