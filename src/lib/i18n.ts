export type Language = 'tr' | 'en' | 'ar';

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
      level: 'Seviye',
      cloudSync: 'Bulut senkronize:',
      cloudSignIn: 'Bulut Senkronizasyonu & Giriş Yap',
      signIn: 'Giriş Yap',
      collectiveEnergy: 'Kolektif Enerji:'
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
      nuclearOff: 'Sistem Optimal',
      todoTitle: 'Seans Görevleri',
      todoPlaceholder: 'Hızlı bir görev girin ve Enter\'a basın...',
      aiSuggest: 'AI Önerisi',
      aiSuggesting: 'Öneriliyor...',
      priority: 'ÖNCELİK',
      priorityHigh: 'Yüksek',
      priorityMedium: 'Orta',
      priorityLow: 'Düşük',
      importedFromSession: 'Hızlı Görev Seansından Aktarıldı',
      addToTasks: 'Ana Görev Listesine Ekle',
      addedToTasks: 'Ana Görev Listesine Eklendi',
      deleteTask: 'Görevi Sil'
    },
    tasks: {
      title: 'Hızlı Görevler',
      placeholder: 'Karmaşık Proje (örn: Modern Sanat Tarihi)...',
      decompose: 'Parçala',
      noTasks: 'Protokol Bulunmadı',
      addToSession: 'Seans görevlerine ekle',
      addedToSession: 'Eklendi',
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
      manualTitle: 'Manuel Kart Ekle',
      questionLabel: 'Soru',
      answerLabel: 'Cevap/Açıklama',
      questionPlaceholder: 'Örn: Fotosentez nedir?',
      answerPlaceholder: 'Örn: Işık enerjisini kimyasal enerjiye dönüştürme süreci...',
      addManual: 'Kartı Kaydet',
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
      title: 'Kütüphane Sistemi',
      noDocument: 'Belge Yüklenmedi',
      upload: 'Protokol Yükle',
      close: 'Kapat',
      emptyArchive: 'Arşiv Boş',
      emptyDesc: 'Okumak istediğiniz akademik makaleyi veya notu buraya yükleyerek odak modunda inceleyin.',
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
      save: 'Ayarları Kaydet',
      export: 'Yedek İndir (.json)',
      exporting: 'Dışa Aktarılıyor...'
    },
    summary: {
      congrats: 'Harika İş Çıkardın!',
      subtitle: 'Focus seansını başarıyla tamamladın. İşte bu seansta elde ettiğin başarılar:',
      statsTitle: 'Seans Özeti',
      timeFocused: 'Odaklanma Süresi',
      tasksFinished: 'Tamamlanan Görevler',
      xpEarned: 'Kazanılan Deneyim',
      xpSub: 'Seviye atlamak için XP biriktiriyorsun!',
      closeBtn: 'Devam Et',
      celebration: 'Odaklanma Sanatçısı',
      minFocus: 'Minimum 1 seans',
      min: 'dk',
      completedDuring: 'Seansta bitirilenler'
    },
    progression: {
      title: 'Seviye İlerlemesi',
      subtitle: 'Hedeflerine ulaştıkça deneyim puanı kazan.',
      nextLevel: 'Müteakip Seviye',
      xpProgress: 'Seviye İlerleme Puanı',
      simulateXp: 'Simüle Et: +150 XP Kazan',
      testConfetti: 'Kutlamayı Test Et 🎉',
      milestonesTitle: 'Deneyim Kilometre Taşları',
      remaining: 'seviye atlamak için kalan',
      unlocked: 'Açıldı',
      locked: 'Kilitli',
      levelLabel: 'SEVİYE',
      ranks: {
        novice: 'Odak Sempatizanı',
        ranger: 'Enerjik Savaşçı',
        synthesizer: 'Bilge Sentezci',
        grandmaster: 'Altın Odak Ustası',
        emperor: 'Kronos Fatihi'
      },
      milestones: {
        catalyst: 'Seans Hızlandırıcı',
        acoustic: 'Meditasyon Akordu',
        safeguard: 'Mental Kalkan',
        ascension: 'Seviye Atla'
      }
    },
    nuclear: {
      title: 'Nükleer Mod',
      sub: 'MUTLAK ODAK KORUMASI',
      active: 'AKTİF',
      inactive: 'DEVRE DIŞI',
      desc: 'Aktifken, dikkat dağıtıcı tüm bildirimler ve otopilot gezinme engellenir. Caydırıcı görseller devreye girer.',
      warning: 'Pay-to-Pass Sistemi Devreye Girdi'
    },
    achievementsList: {
      close: 'Kapat',
      items: [
        { title: 'Erken Kalkan', desc: 'Sabah 07:00\'den önce ders çalış' },
        { title: 'Derin Dalgıç', desc: '4 odaklanma seansını tamamla' },
        { title: 'Ateşli Seri', desc: '5 günlük seriyi koru' },
        { title: 'Sentezci', desc: '50 yapay zeka kartı oluştur' },
        { title: 'Stratejik Düşünür', desc: '10 karmaşık görevi parçala' },
        { title: 'Mimar', desc: 'Uzun vadeli bir hedefi tamamla' },
        { title: 'Hezarfen', desc: 'Kütüphaneye 5 belge yükle' }
      ]
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
      level: 'Level',
      cloudSync: 'Synced with Cloud:',
      cloudSignIn: 'Cloud Synchronization & Sign In',
      signIn: 'Sign In',
      collectiveEnergy: 'Collective Energy:'
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
      nuclearOff: 'Systems Optimal',
      todoTitle: 'Session Tasks',
      todoPlaceholder: 'Enter a quick task and press Enter...',
      aiSuggest: 'AI Suggest',
      aiSuggesting: 'Suggesting...',
      priority: 'PRIORITY',
      priorityHigh: 'High',
      priorityMedium: 'Medium',
      priorityLow: 'Low',
      importedFromSession: 'Imported from Quick Session Tasks',
      addToTasks: 'Add to Tasks',
      addedToTasks: 'Added to Tasks',
      deleteTask: 'Delete Task'
    },
    tasks: {
      title: 'Quick Tasks',
      placeholder: 'Complex Project (e.g. Modern Art History)...',
      decompose: 'Decompose',
      noTasks: 'No Protocols Found',
      addToSession: 'Add to session tasks',
      addedToSession: 'Added',
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
      manualTitle: 'Add Card Manually',
      questionLabel: 'Question',
      answerLabel: 'Answer / Explanation',
      questionPlaceholder: 'e.g. What is Photosynthesis?',
      answerPlaceholder: 'e.g. The process of converting light energy into chemical energy...',
      addManual: 'Save Card',
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
      title: 'Library System',
      noDocument: 'No Document Loaded',
      upload: 'Upload Document',
      close: 'Close',
      emptyArchive: 'Archive Empty',
      emptyDesc: 'Upload academic papers or lecture notes to review during focus sessions.',
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
      save: 'Save Settings',
      export: 'Download Backup (.json)',
      exporting: 'Exporting...'
    },
    summary: {
      congrats: 'Outstanding Work!',
      subtitle: 'You have successfully completed your focus session. Here is what you achieved:',
      statsTitle: 'Session Summary',
      timeFocused: 'Time Focused',
      tasksFinished: 'Tasks Completed',
      xpEarned: 'XP Gained',
      xpSub: 'Keep gaining XP to level up your focus profile!',
      closeBtn: 'Continue',
      celebration: 'Focus Master',
      minFocus: 'At least 1 focus block',
      min: 'min',
      completedDuring: 'Completed during session'
    },
    progression: {
      title: 'Level Progress',
      subtitle: 'Earn experience points by managing constraints.',
      nextLevel: 'Next Level',
      xpProgress: 'Level Progress Rate',
      simulateXp: 'Simulate: Earn +150 XP',
      testConfetti: 'Test Celebration 🎉',
      milestonesTitle: 'XP Milestones',
      remaining: 'remaining to level up',
      unlocked: 'Unlocked',
      locked: 'Locked',
      levelLabel: 'LEVEL',
      ranks: {
        novice: 'Focus Novice',
        ranger: 'Mindful Ranger',
        synthesizer: 'Sage Synthesizer',
        grandmaster: 'Focus Grandmaster',
        emperor: 'Chronos Emperor'
      },
      milestones: {
        catalyst: 'Session Catalyst',
        acoustic: 'Acoustic Resonance',
        safeguard: 'Mental Safeguard',
        ascension: 'Level Ascension'
      }
    },
    nuclear: {
      title: 'Nuclear Mode',
      sub: 'ABSOLUTE FOCUS SHIELD',
      active: 'ACTIVE',
      inactive: 'DISABLED',
      desc: 'When active, all distracting notifications and autopilot browsing are blocked.',
      warning: 'Pay-to-Pass System Engaged'
    },
    achievementsList: {
      close: 'Close',
      items: [
        { title: 'Early Bird', desc: 'Study before 7 AM' },
        { title: 'Deep Diver', desc: 'Complete 4 focus sessions' },
        { title: 'On Fire', desc: 'Maintain a 5-day streak' },
        { title: 'Synthesizer', desc: 'Create 50 AI Flashcards' },
        { title: 'Strategic Thinker', desc: 'Decompose 10 complex tasks' },
        { title: 'The Architect', desc: 'Complete a long-term goal' },
        { title: 'Polymath', desc: 'Upload 5 documents to library' }
      ]
    }
  },
  ar: {
    nav: {
      focus: 'كرونوس',
      tasks: 'المهام السريعة',
      goals: 'الأهداف',
      memory: 'الذاكرة',
      library: 'المكتبة',
      settings: 'الإعدادات',
      achievements: 'الإنجازات'
    },
    header: {
      streak: 'أيام متتالية',
      level: 'المستوى',
      cloudSync: 'متزامن مع السحابة:',
      cloudSignIn: 'المزامنة السحابية والدخول',
      signIn: 'تسجيل الدخول',
      collectiveEnergy: 'الطاقة الجماعية:'
    },
    timer: {
      start: 'بدء',
      pause: 'إيقاف مؤقت',
      reset: 'إعادة ضبط',
      work: 'التركيز',
      break: 'استراحة',
      longBreak: 'استراحة طويلة',
      focusMode: 'تركيز عالي التردد',
      nuclearOn: 'الوضع الصارم مفعّل',
      nuclearOff: 'النظام في أفضل أداء',
      todoTitle: 'مهام الجلسة',
      todoPlaceholder: 'أدخل مهمة سريعة واضغط Enter...',
      aiSuggest: 'اقتراح ذكي',
      aiSuggesting: 'جارٍ الاقتراح...',
      priority: 'الأولوية',
      priorityHigh: 'عالية',
      priorityMedium: 'متوسطة',
      priorityLow: 'منخفضة',
      importedFromSession: 'تم نقله من مهام الجلسة السريعة',
      addToTasks: 'إضافة لقائمة المهام',
      addedToTasks: 'تمت الإضافة',
      deleteTask: 'حذف المهمة'
    },
    tasks: {
      title: 'المهام السريعة',
      placeholder: 'مشروع معقد (مثال: تاريخ الفن الحديث)...',
      decompose: 'تفكيك الهدف',
      noTasks: 'لم يتم العثور على بروتوكولات',
      addToSession: 'إضافة إلى مهام الجلسة',
      addedToSession: 'تمت الإضافة',
      priority: {
        high: 'عالية',
        medium: 'متوسطة',
        low: 'منخفضة'
      }
    },
    goals: {
      title: 'الأهداف',
      add: 'إضافة هدف',
      category: 'الفئة',
      hours: 'الساعات',
      deadline: 'الموعد النهائي',
      noGoals: 'لم يتم تحديد أهداف طويلة المدى بعد'
    },
    flashcards: {
      stats: 'إحصائيات الذاكرة',
      totalCount: 'إجمالي البطاقات',
      completed: 'المكتملة',
      review: 'مراجعة',
      generator: 'المُولّد الذكي',
      placeholder: 'الصق ملاحظات دراستك هنا...',
      generate: 'توليد البطاقات',
      manualTitle: 'إضافة بطاقة يدوياً',
      questionLabel: 'السؤال',
      answerLabel: 'الإجابة / الشرح',
      questionPlaceholder: 'مثال: ما هي عملية التمثيل الضوئي؟',
      answerPlaceholder: 'مثال: تحويل الطاقة الضوئية إلى طاقة كيميائية...',
      addManual: 'حفظ البطاقة',
      probe: 'السؤال',
      response: 'الإجابة',
      flip: 'انقر للقلب',
      noCards: 'لم يتم إنشاء بطاقات بعد',
      difficulty: {
        hard: 'صعب',
        weak: 'ضعيف',
        strong: 'جيد',
        elite: 'ممتاز'
      }
    },
    library: {
      title: 'نظام المكتبة',
      noDocument: 'لم يتم تحميل أي مستند',
      upload: 'تحميل مستند',
      close: 'إغلاق',
      emptyArchive: 'الأرشيف فارغ',
      emptyDesc: 'قم بتحميل الأوراق الأكاديمية أو الملاحظات لدراستها في وضع التركيز.',
      synergy: 'غرف التآزر',
      rooms: {
        focus: 'قصر التركيز العميق',
        night: 'مكتبة الساهرين',
        coding: 'كهف البرمجة'
      },
      active: 'نشط',
      videoOn: 'إيقاف الكاميرا',
      videoOff: 'تشغيل الكاميرا'
    },
    settings: {
      title: 'إعدادات النظام',
      language: 'لغة النظام',
      theme: 'مظهر الواجهة',
      themes: {
        dark: 'داكن (الفضاء العميق)',
        light: 'فاتح (نقاء الضوء)',
        contrast: 'تباين عالٍ'
      },
      music: {
        title: 'قائمة تشغيل خارجية',
        placeholder: 'الصق رابط Spotify أو Apple Music...',
        curated: 'المقترحة',
        custom: 'قائمتي الخاصة'
      },
      save: 'حفظ الإعدادات',
      export: 'تنزيل نسخة احتياطية (.json)',
      exporting: 'جارٍ التصدير...'
    },
    summary: {
      congrats: 'عمل رائع ومتميز!',
      subtitle: 'لقد أنهيت جلسة التركيز بنجاح. إليك ما حققته في هذه الجلسة:',
      statsTitle: 'ملخص الجلسة',
      timeFocused: 'وقت التركيز',
      tasksFinished: 'المهام المنجزة',
      xpEarned: 'نقاط الخبرة المكتسبة',
      xpSub: 'واصل كسب نقاط XP للارتقاء بملفك الشخصي!',
      closeBtn: 'متابعة',
      celebration: 'سيد التركيز',
      minFocus: 'جلسة تركيز واحدة على الأقل',
      min: 'دقيقة',
      completedDuring: 'المهام المكتملة أثناء الجلسة'
    },
    progression: {
      title: 'تقدم المستوى',
      subtitle: 'اكسب نقاط الخبرة من خلال التزامك بجلسات التركيز.',
      nextLevel: 'المستوى التالي',
      xpProgress: 'معدل تقدم المستوى',
      simulateXp: 'تجربة: اكسب +150 XP',
      testConfetti: 'تجربة الاحتفال 🎉',
      milestonesTitle: 'معالم الخبرة',
      remaining: 'متبقٍ للترقية',
      unlocked: 'مفتوح',
      locked: 'مقفل',
      levelLabel: 'المستوى',
      ranks: {
        novice: 'مبتدئ التركيز',
        ranger: 'مستكشف يقظ',
        synthesizer: 'حكيم المعرفة',
        grandmaster: 'أستاذ التركيز الذهبي',
        emperor: 'إمبراطور كرونوس'
      },
      milestones: {
        catalyst: 'مُحفّز الجلسات',
        acoustic: 'الرنين الصوتي',
        safeguard: 'الدرع الذهني',
        ascension: 'ترقية المستوى'
      }
    },
    nuclear: {
      title: 'الوضع الصارم',
      sub: 'حماية التركيز المطلق',
      active: 'مفعّل',
      inactive: 'معطّل',
      desc: 'عند التفعيل، يتم حظر جميع المشتتات والإشعارات والتصفح العشوائي لضمان أعلى إنتاجية.',
      warning: 'نظام حظر التشتت قيد التشغيل'
    },
    achievementsList: {
      close: 'إغلاق',
      items: [
        { title: 'المستيقظ مبكراً', desc: 'الدراسة قبل الساعة 7 صباحاً' },
        { title: 'الغواص المتعمق', desc: 'إتمام 4 جلسات تركيز' },
        { title: 'سلسلة حماسية', desc: 'الحفاظ على سلسلة 5 أيام متتالية' },
        { title: 'المُولّد الذكي', desc: 'إنشاء 50 بطاقة تعليمية ذكية' },
        { title: 'المفكر الاستراتيجي', desc: 'تفكيك 10 مهام معقدة' },
        { title: 'المعماري', desc: 'إنجاز هدف طويل المدى' },
        { title: 'الموسوعي', desc: 'رفع 5 مستندات إلى المكتبة' }
      ]
    }
  }
};
