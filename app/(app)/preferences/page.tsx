'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Save } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useAuthActions } from '@/hooks/useAuthActions';
import { useRouter } from 'next/navigation';
import { UserPreferences } from '@/types';

const PreferencesPage = () => {
  const { currentUser } = useAuth();
  const router = useRouter();
  const { updatePreferences } = useAuthActions();
  const [isSaving, setIsSaving] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'dark',
    language: 'en',
    autoPlay: true,
    autoPlayNext: true,
    autoSkipIntro: false,
    autoSkipCredits: false,
    subtitles: false,
    subtitleLanguage: 'en',
    qualityPreference: 'auto',
    playbackSpeed: 1,
    notifications: true,
  });

  useEffect(() => {
    if (!currentUser) {
      router.push('/auth/login');
      return;
    }

    if (currentUser.preferences) {
      setPreferences(currentUser.preferences);
    }
  }, [currentUser, router]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updatePreferences(preferences);
      // Show success message
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="bg-black text-white min-h-screen pt-20">
      <div className="max-w-2xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link href="/profile">
            <motion.button
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6"
              whileHover={{ x: -5 }}
            >
              <ArrowLeft size={20} />
              Back to Profile
            </motion.button>
          </Link>

          <h1 className="text-4xl font-bold">Preferences</h1>
          <p className="text-gray-400 mt-2">Customize your streaming experience</p>
        </motion.div>

        {/* Preferences Card */}
        <motion.div
          className="bg-white/5 border border-white/10 rounded-lg p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="space-y-8">
            {/* Display Preferences */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Display</h3>

              <div className="space-y-4">
                {/* Theme */}
                <div>
                  <label className="block text-sm font-medium mb-2">Theme</label>
                  <select
                    value={preferences.theme}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        theme: e.target.value as 'light' | 'dark',
                      })
                    }
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                  </select>
                </div>

                {/* Language */}
                <div>
                  <label className="block text-sm font-medium mb-2">Language</label>
                  <select
                    value={preferences.language}
                    onChange={(e) =>
                      setPreferences({ ...preferences, language: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="ja">Japanese</option>
                    <option value="zh">Chinese</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Playback Preferences */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Playback</h3>

              <div className="space-y-4">
                {/* Quality */}
                <div>
                  <label className="block text-sm font-medium mb-2">Video Quality</label>
                  <select
                    value={preferences.qualityPreference}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        qualityPreference: e.target.value as any,
                      })
                    }
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="auto">Auto</option>
                    <option value="480p">480p</option>
                    <option value="720p">720p</option>
                    <option value="1080p">1080p</option>
                    <option value="4k">4K</option>
                  </select>
                </div>

                {/* Playback Speed */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Default Playback Speed: {preferences.playbackSpeed}x
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.25"
                    value={preferences.playbackSpeed}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        playbackSpeed: parseFloat(e.target.value),
                      })
                    }
                    className="w-full cursor-pointer"
                  />
                </div>

                {/* Subtitle Language */}
                <div>
                  <label className="block text-sm font-medium mb-2">Subtitle Language</label>
                  <select
                    value={preferences.subtitleLanguage}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        subtitleLanguage: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="ja">Japanese</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Automatic Features */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Automatic Features</h3>

              <div className="space-y-3">
                {/* Auto Play */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.autoPlay}
                    onChange={(e) =>
                      setPreferences({ ...preferences, autoPlay: e.target.checked })
                    }
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm">Auto-play videos</span>
                </label>

                {/* Auto Play Next */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.autoPlayNext}
                    onChange={(e) =>
                      setPreferences({ ...preferences, autoPlayNext: e.target.checked })
                    }
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm">Auto-play next episode</span>
                </label>

                {/* Auto Skip Intro */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.autoSkipIntro}
                    onChange={(e) =>
                      setPreferences({ ...preferences, autoSkipIntro: e.target.checked })
                    }
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm">Auto-skip intro</span>
                </label>

                {/* Auto Skip Credits */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.autoSkipCredits}
                    onChange={(e) =>
                      setPreferences({ ...preferences, autoSkipCredits: e.target.checked })
                    }
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm">Auto-skip credits</span>
                </label>

                {/* Subtitles */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.subtitles}
                    onChange={(e) =>
                      setPreferences({ ...preferences, subtitles: e.target.checked })
                    }
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm">Show subtitles by default</span>
                </label>

                {/* Notifications */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.notifications}
                    onChange={(e) =>
                      setPreferences({ ...preferences, notifications: e.target.checked })
                    }
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm">Enable notifications</span>
                </label>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <motion.button
            onClick={handleSave}
            disabled={isSaving}
            className="mt-8 w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Save size={20} />
            {isSaving ? 'Saving...' : 'Save Preferences'}
          </motion.button>
        </motion.div>
      </div>
    </main>
  );
};

export default PreferencesPage;
