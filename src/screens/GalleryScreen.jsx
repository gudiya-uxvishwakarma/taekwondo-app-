import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  Image,
  Dimensions,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import RNFS from 'react-native-fs';
import { useNavigation } from '../context/NavigationContext';
import Icon from '../components/common/Icon';
import api from '../services/api';
import API_CONFIG from '../config/api';

const { width } = Dimensions.get('window');
const imageWidth = (width - 60) / 2; // 2 columns with spacing

const GalleryScreen = () => {
  const { navigate } = useNavigation();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    loadGalleryImages();
  }, []);

  const loadGalleryImages = async () => {
    try {
      setLoading(true);
      console.log('📸 Loading gallery images from backend...');
      
      // Fetch gallery images from backend
      const response = await api.get('/gallery');
      
      if (response.status === 'success' && response.data) {
        const galleryImages = response.data.photos || response.data.images || response.data || [];
        setImages(galleryImages);
        console.log('✅ Loaded', galleryImages.length, 'images');
      } else {
        console.log('⚠️ No images found');
        setImages([]);
      }
    } catch (error) {
      console.error('❌ Error loading gallery:', error);
      // Don't show alert, just log the error
      console.log('Using empty gallery');
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadGalleryImages();
    setRefreshing(false);
  };

  const handleBackPress = () => {
    navigate('Dashboard');
  };

  const requestStoragePermission = async () => {
    if (Platform.OS !== 'android') {
      return true;
    }

    try {
      if (Platform.Version >= 33) {
        return true;
      }

      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to your storage to download images',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Permission error:', err);
      return false;
    }
  };

  const handleDownloadImage = async (image) => {
    try {
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        Alert.alert('Permission Denied', 'Storage permission is required to download images');
        return;
      }

      setDownloading(image._id);
      console.log('📥 Downloading image:', image.title);

      // Get full image URL - use 'photo' field from Gallery model
      let imageUrl = image.photo || image.imageUrl || image.filePath;
      if (imageUrl.startsWith('/')) {
        const serverUrl = API_CONFIG.BASE_URL.replace('/api', '');
        imageUrl = `${serverUrl}/${imageUrl}`;
      } else if (!imageUrl.startsWith('http')) {
        const serverUrl = API_CONFIG.BASE_URL.replace('/api', '');
        imageUrl = `${serverUrl}/${imageUrl}`;
      }

      console.log('📥 Image URL:', imageUrl);

      // Get file extension
      const fileExtension = imageUrl.split('.').pop() || 'jpg';
      const fileName = `gallery_${Date.now()}.${fileExtension}`;
      
      // Determine download path
      const downloadPath = Platform.OS === 'ios'
        ? `${RNFS.DocumentDirectoryPath}/${fileName}`
        : `${RNFS.DownloadDirectoryPath}/${fileName}`;

      console.log('📁 Download path:', downloadPath);

      // Download the image
      const downloadResult = await RNFS.downloadFile({
        fromUrl: imageUrl,
        toFile: downloadPath,
        background: true,
        discretionary: true,
        cacheable: false,
        headers: {
          'Accept': 'image/jpeg,image/png,image/jpg,*/*',
        },
        connectionTimeout: 15000,
        readTimeout: 15000,
      }).promise;

      console.log('✅ Download result:', downloadResult);

      if (downloadResult.statusCode === 200) {
        Alert.alert(
          'Download Complete',
          `Image has been saved to your Downloads folder.\n\nFile: ${fileName}`,
          [{ text: 'OK' }]
        );
      } else {
        throw new Error(`Download failed with status code: ${downloadResult.statusCode}`);
      }
    } catch (error) {
      console.error('❌ Download error:', error);
      Alert.alert('Download Failed', 'Unable to download image. Please try again.');
    } finally {
      setDownloading(null);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#006CB5" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Icon name="arrow-back" size={24} color="#fff" type="MaterialIcons" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Gallery</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#006CB5" />
          <Text style={styles.loadingText}>Loading gallery...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#006CB5" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Icon name="arrow-back" size={24} color="#fff" type="MaterialIcons" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gallery</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={loadGalleryImages}>
          <Icon name="refresh" size={24} color="#fff" type="MaterialIcons" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#006CB5']}
            tintColor="#006CB5"
          />
        }
      >
        {images.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="photo-library" size={64} color="#ccc" type="MaterialIcons" />
            <Text style={styles.emptyTitle}>No Images</Text>
            <Text style={styles.emptyText}>Gallery images will appear here</Text>
          </View>
        ) : (
          <View style={styles.imageGrid}>
            {images.map((image, index) => {
              // Get image URL - use 'photo' field from Gallery model
              let imageUrl = image.photo || image.imageUrl || image.filePath || '';
              if (imageUrl && !imageUrl.startsWith('http')) {
                if (!imageUrl.startsWith('/')) {
                  imageUrl = '/' + imageUrl;
                }
                imageUrl = `${API_CONFIG.BASE_URL.replace('/api', '')}${imageUrl}`;
              }
              
              return (
                <View key={image._id || index} style={styles.imageCard}>
                  <Image
                    source={{ uri: imageUrl }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                  <View style={styles.imageOverlay}>
                    <TouchableOpacity
                      style={styles.downloadButton}
                      onPress={() => handleDownloadImage(image)}
                      disabled={downloading === image._id}
                    >
                      {downloading === image._id ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Icon name="file-download" size={20} color="#fff" type="MaterialIcons" />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#006CB5',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7f8c8d',
    marginTop: 16,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  imageCard: {
    width: imageWidth,
    height: imageWidth,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  downloadButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#006CB5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#666',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
});

export default GalleryScreen;
