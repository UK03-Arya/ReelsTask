import React, { useState, useRef } from 'react';
import {
  View,
  FlatList,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentVideo } from '../store/redux';
import Video from 'react-native-video';

const { height, width } = Dimensions.get('window');

const VIDEO_URLS = [
  'https://rentlog-test.s3.ap-south-1.amazonaws.com/Property/Property_Videos/U66729265629_P17204229697.mp4',
  'https://rentlog-test.s3.ap-south-1.amazonaws.com/Property/Property_Videos/U66958134760_P17222731714.mp4',
  'https://rentlog-test.s3.ap-south-1.amazonaws.com/Property/Property_Videos/U66958134760_P17252017967.mp4',
  'https://rentlog-test.s3.ap-south-1.amazonaws.com/Property/Property_Videos/U67183397324_P17267402362.mp4',
  'https://rentlog-test.s3.ap-south-1.amazonaws.com/Property/Property_Videos/U02323667072_P17276679393.mp4',
  'https://rentlog-test.s3.ap-south-1.amazonaws.com/Property/Property_Videos/U66958134760_P17284784209.mp4',
  'https://rentlog-test.s3.ap-south-1.amazonaws.com/Property/Property_Videos/U02569206146_P17295081505.mp4',
  'https://rentlog-test.s3.ap-south-1.amazonaws.com/Property/Property_Videos/U67183397324_P17308013161.mp4',
  'https://rentlog-test.s3.ap-south-1.amazonaws.com/Property/Property_Videos/U00627290892_P17318205217.mp4',
  'https://rentlog-test.s3.ap-south-1.amazonaws.com/Property/Property_Videos/U00627290892_P17347010456.mp4',
];

const ReelScreen = () => {
  const dispatch = useDispatch();
  const currentIndex = useSelector((state) => state.currentVideoIndex);

  const [pausedIndex, setPausedIndex] = useState(null);
  const [showIconIndex, setShowIconIndex] = useState(null);
  const [iconType, setIconType] = useState('');
  const [loadingStates, setLoadingStates] = useState({});
  const flatListRef = useRef(null);
  const iconTimeoutRef = useRef(null);

  const handleTap = (index) => {
    const isPaused = pausedIndex === index;
    const newPausedState = isPaused ? null : index;

    setPausedIndex(newPausedState);
    setShowIconIndex(index);
    setIconType(isPaused ? 'play' : 'pause');

    if (iconTimeoutRef.current) clearTimeout(iconTimeoutRef.current);
    iconTimeoutRef.current = setTimeout(() => setShowIconIndex(null), 1500);
  };

  const handleVideoEnd = () => {
    if (currentIndex < VIDEO_URLS.length - 1) {
      dispatch(setCurrentVideo(currentIndex + 1));
    }
  };

  const renderItem = ({ item, index }) => {
    const isCurrent = index === currentIndex;
    const isPaused = pausedIndex === index;

    return (
      <View style={styles.videoContainer}>
        <Video
          source={{ uri: item }}
          style={styles.video}
          resizeMode="cover"
          paused={!isCurrent || isPaused}
          onLoadStart={() =>
            isCurrent &&
            setLoadingStates((prev) => ({ ...prev, [index]: true }))
          }
          onBuffer={({ isBuffering }) =>
            isCurrent &&
            setLoadingStates((prev) => ({ ...prev, [index]: isBuffering }))
          }
          onLoad={() =>
            isCurrent &&
            setLoadingStates((prev) => ({ ...prev, [index]: false }))
          }
          onEnd={handleVideoEnd}
          onError={(e) => {
            console.warn('Video error:', e);
            setLoadingStates((prev) => ({ ...prev, [index]: false }));
          }}
          repeat
        />

        {/* Tap overlay */}
        <TouchableWithoutFeedback onPress={() => handleTap(index)}>
          <View style={styles.tapOverlay} />
        </TouchableWithoutFeedback>

        {/* Loader */}
        {(loadingStates[index] && isCurrent) && (
          <ActivityIndicator size="large" color="#fff" style={styles.loader} />
        )}

        {/* Play/Pause icon */}
        {isCurrent && showIconIndex === index && (
          <View style={styles.iconOverlay}>
            <Text style={styles.iconText}>
              {iconType === 'play' ? '▶️' : '⏸️'}
            </Text>
          </View>
        )}

        {/* Right action buttons */}
        <View style={styles.rightActions}>
          <Text style={styles.iconSpacing}>❤️</Text>
          <Text style={styles.iconSpacing}>💬</Text>
          <Text style={styles.iconSpacing}>🔄</Text>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      ref={flatListRef}
      data={VIDEO_URLS}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      pagingEnabled
      horizontal={false}
      showsVerticalScrollIndicator={false}
      onMomentumScrollEnd={(e) => {
        const index = Math.floor(e.nativeEvent.contentOffset.y / height);
        dispatch(setCurrentVideo(index));
        setPausedIndex(null);
        setShowIconIndex(null);
      }}
      extraData={{ currentIndex, pausedIndex, showIconIndex, loadingStates }}
    />
  );
};

const styles = StyleSheet.create({
  videoContainer: {
    height,
    width,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  video: {
    height,
    width,
    position: 'absolute',
  },
  tapOverlay: {
    position: 'absolute',
    height,
    width,
    top: 0,
    left: 0,
    zIndex: 1,
  },
  loader: {
    position: 'absolute',
    top: '50%',
    alignSelf: 'center',
  },
  iconOverlay: {
    position: 'absolute',
    top: '45%',
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 20,
    borderRadius: 50,
  },
  iconText: {
    fontSize: 40,
    color: '#fff',
    textAlign: 'center',
  },
  rightActions: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconSpacing: {
    fontSize: 28,
    color: '#fff',
    marginBottom: 20,
  },
});

export default ReelScreen;
