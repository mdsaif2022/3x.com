import { Video, AdsterraAd, UserSession } from '@/types/database';
import { mockApi } from '@/data/demo';
import { initializeFirebase } from '@/lib/firebase';

// Video API functions
export async function getVideos(): Promise<Video[]> {
  try {
    // For demo purposes, use mock data
    // In production, uncomment the Firebase code below
    return await mockApi.getVideos();
    
    /*
    const videosRef = collection(db, 'videos');
    const q = query(videosRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    })) as Video[];
    */
  } catch (error) {
    console.error('Error fetching videos:', error);
    return [];
  }
}

export async function addVideo(video: Omit<Video, 'id' | 'createdAt' | 'updatedAt'>): Promise<Video> {
  try {
    // For demo purposes, use mock data
    return await mockApi.addVideo(video);
    
    /*
    const videoRef = await addDoc(collection(db, 'videos'), {
      ...video,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    return {
      id: videoRef.id,
      ...video,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Video;
    */
  } catch (error) {
    console.error('Error adding video:', error);
    throw error;
  }
}

export async function updateVideoById(id: string, updates: Partial<Video>): Promise<boolean> {
  try {
    // For demo purposes, use mock data
    return await mockApi.updateVideo(id, updates);
    
    /*
    const videoRef = doc(db, 'videos', id);
    await updateDoc(videoRef, {
      ...updates,
      updatedAt: new Date(),
    });
    return true;
    */
  } catch (error) {
    console.error('Error updating video:', error);
    return false;
  }
}

export async function deleteVideoById(id: string): Promise<boolean> {
  try {
    // For demo purposes, use mock data
    return await mockApi.deleteVideo(id);
    
    /*
    const videoRef = doc(db, 'videos', id);
    await deleteDoc(videoRef);
    return true;
    */
  } catch (error) {
    console.error('Error deleting video:', error);
    return false;
  }
}

export async function getVideoById(id: string): Promise<Video | null> {
  try {
    // For demo purposes, use mock data
    return await mockApi.getVideoById(id);
    
    /*
    const videoRef = doc(db, 'videos', id);
    const videoSnap = await getDoc(videoRef);
    
    if (videoSnap.exists()) {
      return {
        id: videoSnap.id,
        ...videoSnap.data(),
        createdAt: videoSnap.data().createdAt.toDate(),
        updatedAt: videoSnap.data().updatedAt.toDate(),
      } as Video;
    }
    return null;
    */
  } catch (error) {
    console.error('Error fetching video:', error);
    return null;
  }
}

export async function incrementVideoViews(id: string): Promise<void> {
  try {
    // For demo purposes, use mock data
    await mockApi.incrementVideoViews(id);
    
    /*
    const videoRef = doc(db, 'videos', id);
    const videoSnap = await getDoc(videoRef);
    
    if (videoSnap.exists()) {
      const currentViews = videoSnap.data().views || 0;
      await updateDoc(videoRef, {
        views: currentViews + 1,
        updatedAt: new Date(),
      });
    }
    */
  } catch (error) {
    console.error('Error incrementing views:', error);
  }
}

export async function incrementVideoDownloads(id: string): Promise<void> {
  try {
    // For demo purposes, use mock data
    await mockApi.incrementVideoDownloads(id);
    
    /*
    const videoRef = doc(db, 'videos', id);
    const videoSnap = await getDoc(videoRef);
    
    if (videoSnap.exists()) {
      const currentDownloads = videoSnap.data().downloads || 0;
      await updateDoc(videoRef, {
        downloads: currentDownloads + 1,
        updatedAt: new Date(),
      });
    }
    */
  } catch (error) {
    console.error('Error incrementing downloads:', error);
  }
}

// Ad API functions
export async function getBannerAds(): Promise<AdsterraAd[]> {
  try {
    // For demo purposes, use mock data
    return await mockApi.getBannerAds();
    
    /*
    const adsRef = collection(db, 'ads');
    const q = query(adsRef, where('type', '==', 'banner'), where('isActive', '==', true));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
    })) as AdsterraAd[];
    */
  } catch (error) {
    console.error('Error fetching banner ads:', error);
    return [];
  }
}

export async function getNativeAds(): Promise<AdsterraAd[]> {
  try {
    // For demo purposes, use mock data
    return await mockApi.getNativeAds();
    
    /*
    const adsRef = collection(db, 'ads');
    const q = query(adsRef, where('type', '==', 'native'), where('isActive', '==', true));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
    })) as AdsterraAd[];
    */
  } catch (error) {
    console.error('Error fetching native ads:', error);
    return [];
  }
}

export async function getSmartDirectLinks(): Promise<AdsterraAd[]> {
  try {
    // For demo purposes, use mock data
    return await mockApi.getSmartDirectLinks();
    
    /*
    const adsRef = collection(db, 'ads');
    const q = query(adsRef, where('type', '==', 'smart_direct_link'), where('isActive', '==', true));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
    })) as AdsterraAd[];
    */
  } catch (error) {
    console.error('Error fetching smart direct links:', error);
    return [];
  }
}

export async function incrementAdClicks(adId: string): Promise<void> {
  try {
    // For demo purposes, use mock data
    await mockApi.incrementAdClicks(adId);
    
    /*
    const adRef = doc(db, 'ads', adId);
    const adSnap = await getDoc(adRef);
    
    if (adSnap.exists()) {
      const currentClicks = adSnap.data().clickCount || 0;
      await updateDoc(adRef, {
        clickCount: currentClicks + 1,
      });
    }
    */
  } catch (error) {
    console.error('Error incrementing ad clicks:', error);
  }
}

// Session API functions - using localStorage for demo purposes
export async function createUserSession(): Promise<string> {
  try {
    // For demo purposes, generate a session ID
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store in localStorage for demo
    if (typeof window !== 'undefined') {
      localStorage.setItem('userSession', sessionId);
      localStorage.setItem(`session_${sessionId}`, JSON.stringify({
        adViewTimes: {},
        tokens: {},
        createdAt: new Date().toISOString(),
      }));
    }
    
    return sessionId;
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
}

export async function getUserSession(sessionId: string): Promise<UserSession | null> {
  try {
    // For demo purposes, get from localStorage
    if (typeof window !== 'undefined') {
      const sessionData = localStorage.getItem(`session_${sessionId}`);
      if (sessionData) {
        const data = JSON.parse(sessionData);
        return {
          id: sessionId,
          adViewTimes: data.adViewTimes || {},
          tokens: data.tokens || {},
          createdAt: new Date(data.createdAt),
        } as UserSession;
      }
    }
    return null;
  } catch (error) {
    console.error('Error fetching session:', error);
    return null;
  }
}

export async function updateUserSession(sessionId: string, updates: Partial<UserSession>): Promise<void> {
  try {
    // For demo purposes, update localStorage
    if (typeof window !== 'undefined') {
      const sessionData = localStorage.getItem(`session_${sessionId}`);
      if (sessionData) {
        const data = JSON.parse(sessionData);
        const updatedData = { ...data, ...updates };
        localStorage.setItem(`session_${sessionId}`, JSON.stringify(updatedData));
      }
    }
  } catch (error) {
    console.error('Error updating session:', error);
  }
}
