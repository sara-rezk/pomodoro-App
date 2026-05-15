
export type Language = 'tr' | 'en';

export const translations = {
  tr: {
    nav: {
      focus: 'Kronos',
      tasks: 'Hızlı Görevler',
      goals: 'Hedefler',
      memory: 'Hafıza',
      library: 'Kütüphane',
      settings: 'Ayarlar',
      achievements: 'Başarılar'
    },
    header: {
      streak: 'Gün Seri',
      level: 'Seviye'
    },
    timer: {
      start: 'BAŞLAT',
      pause: 'DURAKLAT',
      reset: 'SIFIRLA',
      work: 'Focus',
      break: 'Break',
      longBreak: 'Long Break',
      focusMode: 'Yüksek Frekans Odak',
      nuclearOn: 'Nuclear Mode Aktif',
      nuclearOff: 'Sistem Optimal'
    },
    tasks: {
      title: 'Hızlı Görevler',
      placeholder: 'Karmaşık Proje (örn: Modern Sanat Tarihi)...',
      decompose: 'Parçala',
      noTasks: 'Protokol Bulunmadı',
      priority: {
        high: 'Yüksek',
        medium: 'Orta',
        low: 'Düşük'
      }
    },
    goals: {
      title: 'Hedefler',
      add: 'Hedef Ekle',
      category: 'Kategori',
      hours: 'Saat',
      deadline: 'Son Tarih',
      noGoals: 'Henüz uzun vadeli hedef belirlenmedi'
    },
    flashcards: {
      stats: 'Hafıza İstatistikleri',
      totalCount: 'Toplam Kart',
      completed: 'Tamamlanan',
      review: 'Gözden Geçir',
      generator: 'AI Sentezleyici',
      placeholder: 'Ders notlarını buraya yapıştır...',
      generate: 'Kart Oluştur',
      probe: 'Soru',
      response: 'Yanıt',
      flip: 'Çevirmek için tıkla',
      noCards: 'Henüz kart oluşturulmadı',
      difficulty: {
        hard: 'Zor',
        weak: 'Zayıf',
        strong: 'İyi',
        elite: 'Harika'
      }
    },
    library: {
      synergy: 'Sinerji Odaları',
      rooms: {
        focus: 'Derin Odak Sarayı',
        night: 'Gece Kuşu Kütüphanesi',
        coding: 'Kod Mağarası'
      },
      active: 'aktif',
      videoOn: 'Kamerayı Kapat',
      videoOff: 'Kamerayı Aç'
    },
    settings: {
      title: 'Sistem Ayarları',
      language: 'Dil Seçeneği',
      theme: 'Arayüz Teması',
      themes: {
        dark: 'Karanlık (Deep Space)',
        light: 'Aydınlık (Pure Light)',
        contrast: 'Yüksek Kontrast'
      },
      music: {
        title: 'Harici Çalma Listesi',
        placeholder: 'Spotify/Apple Music URL yapıştır...',
        curated: 'Önerilenler',
        custom: 'Kendi Listem'
      },
      save: 'Ayarları Kaydet'
    }
  },
  en: {
    nav: {
      focus: 'Chronos',
      tasks: 'Quick Tasks',
      goals: 'Goals',
      memory: 'Memory',
      library: 'Library',
      settings: 'Settings',
      achievements: 'Achievements'
    },
    header: {
      streak: 'Day Streak',
      level: 'Level'
    },
    timer: {
      start: 'START',
      pause: 'PAUSE',
      reset: 'RESET',
      work: 'Focus',
      break: 'Break',
      longBreak: 'Long Break',
      focusMode: 'High Frequency Focus',
      nuclearOn: 'Nuclear Mode Active',
      nuclearOff: 'Systems Optimal'
    },
    tasks: {
      title: 'Quick Tasks',
      placeholder: 'Complex Project (e.g. Modern Art History)...',
      decompose: 'Decompose',
      noTasks: 'No Protocols Found',
      priority: {
        high: 'High',
        medium: 'Medium',
        low: 'Low'
      }
    },
    goals: {
      title: 'Goals',
      add: 'Add Goal',
      category: 'Category',
      hours: 'Hours',
      deadline: 'Deadline',
      noGoals: 'No long-term goals set yet'
    },
    flashcards: {
      stats: 'Memory Stats',
      totalCount: 'Total Cards',
      completed: 'Completed',
      review: 'Review',
      generator: 'AI Synthesizer',
      placeholder: 'Paste your study notes here...',
      generate: 'Synthesize Cards',
      probe: 'Probe',
      response: 'Response',
      flip: 'Click to flip',
      noCards: 'No cards created yet',
      difficulty: {
        hard: 'Hard',
        weak: 'Weak',
        strong: 'Good',
        elite: 'Elite'
      }
    },
    library: {
      synergy: 'Synergy Rooms',
      rooms: {
        focus: 'Deep Focus Palace',
        night: 'Night Owl Library',
        coding: 'Coding Cave'
      },
      active: 'active',
      videoOn: 'Turn Camera Off',
      videoOff: 'Turn Camera On'
    },
    settings: {
      title: 'System Settings',
      language: 'Language Selection',
      theme: 'Interface Theme',
      themes: {
        dark: 'Dark (Deep Space)',
        light: 'Light (Pure Light)',
        contrast: 'High Contrast'
      },
      music: {
        title: 'External Playlist',
        placeholder: 'Paste Spotify/Apple Music URL...',
        curated: 'Curated',
        custom: 'My Playlist'
      },
      save: 'Save Settings'
    }
  }
};
