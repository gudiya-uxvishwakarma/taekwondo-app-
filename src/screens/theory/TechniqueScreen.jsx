import React, { useState, useEffect } from 'react';
import {
  View, Text, SafeAreaView, StatusBar, TouchableOpacity,
  ScrollView, StyleSheet, ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import API_CONFIG from '../../config/api';

// ── List Screen ───────────────────────────────────────────────────────────────
const TechniqueScreen = ({ onBack }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  // pointDetail: { point, label } — any level point with detailSections
  const [pointDetail, setPointDetail] = useState(null);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/technique-divisions`);
      const data = await res.json();
      setItems(data.data || []);
    } catch (e) {
      console.log('TechniqueScreen fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  if (pointDetail) {
    return (
      <PointDetailScreen
        point={pointDetail.point}
        onBack={() => setPointDetail(null)}
      />
    );
  }

  if (selected) {
    return (
      <TechniqueDetailScreen
        item={selected}
        onBack={() => setSelected(null)}
        onPointPress={(point) => setPointDetail({ point })}
      />
    );
  }

  const grouped = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#006CB5" />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Division of techniques</Text>
        <View style={{ width: 40 }} />
      </View>
      <View style={styles.divider} />

      {loading ? (
        <ActivityIndicator size="large" color="#006CB5" style={{ marginTop: 60 }} />
      ) : (
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {Object.entries(grouped).map(([category, catItems]) => (
            <View key={category}>
              <Text style={styles.categoryTitle}>{category}</Text>
              {catItems.map((item) => (
                <TouchableOpacity
                  key={item._id}
                  style={styles.subItem}
                  onPress={() => setSelected(item)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.subItemText}>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
          {items.length === 0 && (
            <Text style={styles.emptyText}>No content available.</Text>
          )}
          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

// ── Detail Screen ─────────────────────────────────────────────────────────────
const TechniqueDetailScreen = ({ item, onBack, onPointPress }) => {

  // Render a sub-sub-point (▸ level)
  const renderSubSubPoint = (ssp, sspi) => {
    const obj = typeof ssp === 'string' ? { text: ssp } : ssp;
    const hasDetail = obj.detailSections && obj.detailSections.length > 0;
    return (
      <View key={sspi} style={[styles.pointRow, { paddingLeft: 40 }]}>
        <Text style={styles.subSubPoint}>▸ </Text>
        {hasDetail ? (
          <TouchableOpacity onPress={() => onPointPress(obj)} activeOpacity={0.7} style={styles.pointTextWrap}>
            <Text style={[styles.subSubPoint, styles.pointLink]}>{obj.text}</Text>
          </TouchableOpacity>
        ) : (
          <Text style={[styles.subSubPoint, styles.pointTextWrap]}>{obj.text}</Text>
        )}
      </View>
    );
  };

  // Render a sub-point (◦ level)
  const renderSubPoint = (sp, spi) => {
    const obj = typeof sp === 'string' ? { text: sp, subPoints: [] } : sp;
    const hasDetail = obj.detailSections && obj.detailSections.length > 0;
    return (
      <View key={spi}>
        <View style={[styles.pointRow, { paddingLeft: 20 }]}>
          <Text style={styles.subPoint}>◦ </Text>
          {hasDetail ? (
            <TouchableOpacity onPress={() => onPointPress(obj)} activeOpacity={0.7} style={styles.pointTextWrap}>
              <Text style={[styles.subPoint, styles.pointLink]}>{obj.text}</Text>
            </TouchableOpacity>
          ) : (
            <Text style={[styles.subPoint, styles.pointTextWrap]}>{obj.text}</Text>
          )}
        </View>
        {(obj.subPoints || []).map((ssp, sspi) => renderSubSubPoint(ssp, sspi))}
      </View>
    );
  };

  // Render a point (• level)
  const renderPoint = (pt, pi) => {
    const hasDetail = pt.detailSections && pt.detailSections.length > 0;
    return (
      <View key={pi}>
        <View style={styles.pointRow}>
          <Text style={styles.point}>• </Text>
          {hasDetail ? (
            <TouchableOpacity onPress={() => onPointPress(pt)} activeOpacity={0.7} style={styles.pointTextWrap}>
              <Text style={[styles.point, styles.pointLink]}>{pt.text}</Text>
            </TouchableOpacity>
          ) : (
            <Text style={[styles.point, styles.pointTextWrap]}>{pt.text}</Text>
          )}
        </View>
        {(pt.subPoints || []).map((sp, spi) => renderSubPoint(sp, spi))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#006CB5" />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{item.title}</Text>
        <View style={{ width: 40 }} />
      </View>
      <View style={styles.divider} />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.detailTitle}>{item.title}</Text>

        {/* Sections — each has title, subtitle, description, headingBlocks[].heading + points */}
        {(item.sections || []).length > 0 ? (
          (item.sections || []).map((section, si) => {
            // Support both new headingBlocks and legacy heading+points
            const blocks = section.headingBlocks && section.headingBlocks.length > 0
              ? section.headingBlocks
              : (section.heading || (section.points && section.points.length > 0))
                ? [{ heading: section.heading || '', points: section.points || [] }]
                : [];

            return (
              <View key={si} style={styles.sectionBlock}>
                {!!section.title && (
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                )}
                {!!section.subtitle && (
                  <Text style={styles.sectionSubtitle}>{section.subtitle}</Text>
                )}
                {!!section.description && (
                  <Text style={styles.sectionDescription}>{section.description}</Text>
                )}
                {blocks.map((hb, hi) => (
                  <View key={hi}>
                    {!!hb.heading && (
                      <Text style={styles.sectionHeading}>{hb.heading}</Text>
                    )}
                    {(hb.points || []).map((pt, pi) => renderPoint(pt, pi))}
                  </View>
                ))}
              </View>
            );
          })
        ) : (
          <Text style={styles.emptyText}>No content available.</Text>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

// ── Point Detail Screen ───────────────────────────────────────────────────────
const PointDetailScreen = ({ point, onBack }) => (
  <SafeAreaView style={styles.safe}>
    <StatusBar barStyle="light-content" backgroundColor="#006CB5" />
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn}>
        <Icon name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.headerTitle} numberOfLines={1}>{point.text}</Text>
      <View style={{ width: 40 }} />
    </View>
    <View style={styles.divider} />

    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
      <Text style={styles.detailTitle}>{point.text}</Text>

      {(point.detailSections || []).map((ds, dsi) => (
        <View key={dsi} style={styles.detailSectionCard}>
          {!!ds.title && (
            <Text style={styles.detailSectionTitle}>{ds.title}</Text>
          )}
          {!!ds.subtitle && (
            <Text style={styles.detailSectionSubtitle}>{ds.subtitle}</Text>
          )}
          {!!ds.description && (
            <Text style={styles.detailSectionDesc}>{ds.description}</Text>
          )}
          {(ds.points || []).filter(p => p && p.trim()).map((p, pi) => (
            <Text key={pi} style={styles.detailSectionPoint}>• {p}</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#006CB5',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  backBtn: { padding: 8, width: 40 },
  headerTitle: { flex: 1, fontSize: 17, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  divider: { height: 2, backgroundColor: '#006CB5' },
  scroll: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
  categoryTitle: {
    fontSize: 15, fontWeight: 'bold', color: '#000',
    marginBottom: 4, marginTop: 20,
  },
  subItem: { paddingVertical: 10, paddingLeft: 20 },
  subItemText: { fontSize: 15, fontWeight: '600', color: '#333' },
  emptyText: { textAlign: 'center', color: '#9ca3af', marginTop: 60, fontSize: 14 },

  // Detail screen
  sectionBlock: { marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#000', marginBottom: 4, marginTop: 14 },
  sectionSubtitle: { fontSize: 14, color: '#555', fontStyle: 'italic', marginBottom: 6 },
  sectionDescription: { fontSize: 14, lineHeight: 22, color: '#333', marginBottom: 8 },
  sectionHeading: { fontSize: 17, fontWeight: 'bold', color: '#000', marginBottom: 6, marginTop: 12 },
  detailTitle: { fontSize: 22, fontWeight: 'bold', color: '#000', marginBottom: 8 },
  detailSubtitle: { fontSize: 15, color: '#555', marginBottom: 8, fontStyle: 'italic' },
  detailDescription: { fontSize: 14, lineHeight: 22, color: '#333', marginBottom: 16 },
  headingBlock: { marginBottom: 16 },
  headingText: { fontSize: 17, fontWeight: 'bold', color: '#000', marginBottom: 6 },

  // Point row — bullet and text side by side so underline only covers the text
  pointRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4, paddingLeft: 4 },
  pointTextWrap: { flex: 1 },

  point: { fontSize: 14, lineHeight: 22, color: '#333' },
  subPoint: { fontSize: 13, lineHeight: 20, color: '#555', marginBottom: 3 },
  subSubPoint: { fontSize: 12, lineHeight: 18, color: '#777', marginBottom: 2 },

  // Link style — only underlines the text, no color change
  pointLink: {
    textDecorationLine: 'underline',
  },

  // Point detail screen
  detailSectionCard: {
    marginBottom: 14,
  },
  detailSectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#000', marginBottom: 6, marginTop: 14 },
  detailSectionSubtitle: { fontSize: 13, color: '#555', fontStyle: 'italic', marginBottom: 6 },
  detailSectionDesc: { fontSize: 14, lineHeight: 22, color: '#333', marginBottom: 10 },
  detailSectionPoint: { fontSize: 14, lineHeight: 22, color: '#333', marginBottom: 3, paddingLeft: 4 },
});

export default TechniqueScreen;
