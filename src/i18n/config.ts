import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      dashboard: 'Dashboard',
      marketplace: 'Marketplace',
      marketIntelligence: 'Market Intelligence',
      seedToolSwap: 'Seed & Tool Swap',
      
      // Dashboard
      farmStatus: 'Farm Status',
      optimal: 'Optimal',
      critical: 'Critical',
      welcomeMessage: 'Welcome back, Farmer Singh. All systems are performing within normal parameters. Your wheat yield projection is up 12% this season.',
      welcomeCritical: 'Welcome back, Farmer Singh. Immediate action required for irrigation.',
      healthyCrops: 'Healthy Crops',
      needsAttention: 'Needs Attention',
      optimalSunlight: 'Optimal Sunlight',
      simulateSensor: 'Simulate Sensor',
      simulating: 'Simulating...',
      
      // Critical Alert
      criticalAlert: 'Critical: Irrigation Required',
      criticalMessage: 'Soil moisture at {{moisture}}% is critically low. Immediate irrigation needed to prevent crop damage.',
      
      // Climate Widget
      realTimeMicroClimate: 'Real-Time Micro-Climate - Punjab Region',
      temperature: 'Temperature',
      humidity: 'Humidity',
      soilMoisture: 'Soil Moisture',
      
      // Soil Health
      soilHealthMonitor: 'Soil Health Monitor - Local Village',
      noSensorData: 'No sensor data available in the last hour',
      clickSimulate: 'Click "Simulate Sensor" to generate data',
      location: 'Location',
      status: 'Status',
      criticalStatus: 'Critical',
      lowStatus: 'Low',
      mediumStatus: 'Medium',
      goodStatus: 'Good',
      excellentStatus: 'Excellent',
      
      // Plant Doctor
      plantDoctor: 'Plant Doctor',
      aiPoweredDiagnosis: 'AI-powered disease detection & treatment',
      uploadLeafPhoto: 'Upload Leaf Photo',
      uploadPrompt: 'Upload a photo of your plant leaf to detect diseases and get treatment recommendations',
      analyzingImage: 'Analyzing leaf image...',
      mayTakeTime: 'This may take up to 30 seconds',
      diagnosisComplete: 'Diagnosis Complete',
      analyzeAnother: 'Analyze Another',
      newUpload: 'New Upload',
      history: 'History',
      diagnosisHistory: 'Diagnosis History',
      noDiagnosisHistory: 'No diagnosis history yet',
      confidence: 'Confidence',
      
      // Carbon Shield
      carbonShield: 'Carbon Shield',
      earnRewards: 'Earn rewards for sustainable farming',
      sustainabilityScore: 'Sustainability Score',
      basedOnEfficiency: 'Based on water efficiency and soil health',
      waterEfficiency: 'Water Efficiency',
      soilHealth: 'Soil Health',
      carbonCreditsEarned: 'Carbon Credits Earned',
      exchangeValue: 'Exchange Value',
      exchangeCredits: 'Exchange Credits',
      processing: 'Processing...',
      minimumCredits: 'Minimum 0.5 credits required to exchange',
      howItWorks: 'How it works',
      maintainMoisture: 'Maintain optimal soil moisture (40-60%)',
      reduceWaste: 'Reduce water waste through efficient irrigation',
      earnCredits: 'Earn 1 credit per 10 sustainability points',
      exchangeRate: 'Exchange rate: 1 credit = ₹100',
      lastUpdated: 'Last updated',
      
      // Market Intelligence
      realTimePrices: 'Real-time crop prices and 7-day predictions',
      weatherScenario: 'Weather Scenario Simulator',
      weatherImpact: 'See how weather anomalies affect crop prices',
      normal: 'Normal',
      drought: 'Drought',
      flood: 'Flood',
      heatwave: 'Heatwave',
      perQuintal: 'Per Quintal (100 kg)',
      dayForecast: '7 Day Forecast',
      marketInsights: 'Market Insights',
      droughtImpact: 'Drought Impact: Water-intensive crops like Rice and Corn show rising price trends due to reduced supply expectations.',
      floodImpact: 'Flood Impact: Excess rainfall can damage standing crops, leading to supply concerns and price increases.',
      heatwaveImpact: 'Heatwave Impact: Extreme temperatures stress crops, particularly affecting yield quality and market prices.',
      stableMarket: 'Stable Market: Normal weather conditions support steady crop growth and stable price trends.',
      
      // Seed & Tool Swap
      seedToolSwapTitle: 'Seed & Tool Swap',
      peerToPeerMarketplace: 'Peer-to-peer marketplace for seeds and equipment',
      addListing: 'Add Listing',
      allItems: 'All Items',
      seeds: 'Seeds',
      tools: 'Tools',
      equipment: 'Equipment',
      forSale: 'For Sale',
      forRent: 'For Rent',
      perDay: 'per day',
      organic: 'Organic',
      hybrid: 'Hybrid',
      heirloom: 'Heirloom',
      available: 'Available',
      sendRequest: 'Send Request',
      requestSent: 'Request Sent',
      noListings: 'No listings available',
      addFirstListing: 'Be the first to add a listing!',
      
      // Request Dialog
      requestItem: 'Request Item',
      requestType: 'Request Type',
      purchase: 'Purchase',
      rent: 'Rent',
      quantityNeeded: 'Quantity Needed',
      message: 'Message',
      optionalMessage: 'Optional message to the owner',
      cancel: 'Cancel',
      submit: 'Submit Request',
      
      // Add Listing Dialog
      addNewListing: 'Add New Listing',
      editListing: 'Edit Listing',
      title: 'Title',
      description: 'Description',
      category: 'Category',
      seed: 'Seed',
      tool: 'Tool',
      equipmentItem: 'Equipment',
      seedType: 'Seed Type',
      quantity: 'Quantity',
      pricePerUnit: 'Price per Unit (₹)',
      rentalPrice: 'Rental Price per Day (₹)',
      locationField: 'Location',
      save: 'Save',
      
      // Notifications
      notifications: 'Notifications',
      noNotifications: 'No notifications',
      newRequest: 'New Request Received',
      requestMessage: 'You have a new {{type}} request for your listing.',
      
      // Common
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      close: 'Close',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      
      // Offline Mode
      offline: 'Offline',
      online: 'Online',
      offlineMode: 'You are currently offline',
      offlineMessage: 'Some features may be limited. Data will sync when connection is restored.',
      syncPending: 'Sync Pending',
      syncing: 'Syncing...',
      syncComplete: 'Sync Complete',
      
      // Financial
      financial: 'Financial Management',
      financialDesc: 'Manage insurance, expenses, and profitability',
      walletBalance: 'Wallet Balance',
      microInsurance: 'Micro-Insurance',
      expenseTracker: 'Expense Tracker',
      profitability: 'Profitability',
    }
  },
  hi: {
    translation: {
      // Navigation
      dashboard: 'डैशबोर्ड',
      marketplace: 'बाज़ार',
      marketIntelligence: 'बाज़ार जानकारी',
      seedToolSwap: 'बीज और औज़ार विनिमय',
      
      // Dashboard
      farmStatus: 'खेत की स्थिति',
      optimal: 'अनुकूल',
      critical: 'गंभीर',
      welcomeMessage: 'स्वागत है, किसान सिंह। सभी प्रणालियाँ सामान्य रूप से काम कर रही हैं। आपकी गेहूं की उपज का अनुमान इस सीज़न में 12% बढ़ा है।',
      welcomeCritical: 'स्वागत है, किसान सिंह। सिंचाई के लिए तत्काल कार्रवाई आवश्यक है।',
      healthyCrops: 'स्वस्थ फसलें',
      needsAttention: 'ध्यान चाहिए',
      optimalSunlight: 'अनुकूल धूप',
      simulateSensor: 'सेंसर सिमुलेट करें',
      simulating: 'सिमुलेट हो रहा है...',
      
      // Critical Alert
      criticalAlert: 'गंभीर: सिंचाई आवश्यक',
      criticalMessage: 'मिट्टी की नमी {{moisture}}% पर बहुत कम है। फसल को नुकसान से बचाने के लिए तत्काल सिंचाई की आवश्यकता है।',
      
      // Climate Widget
      realTimeMicroClimate: 'वास्तविक समय सूक्ष्म-जलवायु - पंजाब क्षेत्र',
      temperature: 'तापमान',
      humidity: 'आर्द्रता',
      soilMoisture: 'मिट्टी की नमी',
      
      // Soil Health
      soilHealthMonitor: 'मिट्टी स्वास्थ्य मॉनिटर - स्थानीय गाँव',
      noSensorData: 'पिछले घंटे में कोई सेंसर डेटा उपलब्ध नहीं',
      clickSimulate: 'डेटा उत्पन्न करने के लिए "सेंसर सिमुलेट करें" पर क्लिक करें',
      location: 'स्थान',
      status: 'स्थिति',
      criticalStatus: 'गंभीर',
      lowStatus: 'कम',
      mediumStatus: 'मध्यम',
      goodStatus: 'अच्छा',
      excellentStatus: 'उत्कृष्ट',
      
      // Plant Doctor
      plantDoctor: 'पौधा डॉक्टर',
      aiPoweredDiagnosis: 'AI-संचालित रोग पहचान और उपचार',
      uploadLeafPhoto: 'पत्ती की फोटो अपलोड करें',
      uploadPrompt: 'रोगों का पता लगाने और उपचार की सिफारिशें प्राप्त करने के लिए अपने पौधे की पत्ती की फोटो अपलोड करें',
      analyzingImage: 'पत्ती की छवि का विश्लेषण हो रहा है...',
      mayTakeTime: 'इसमें 30 सेकंड तक का समय लग सकता है',
      diagnosisComplete: 'निदान पूर्ण',
      analyzeAnother: 'दूसरा विश्लेषण करें',
      newUpload: 'नया अपलोड',
      history: 'इतिहास',
      diagnosisHistory: 'निदान इतिहास',
      noDiagnosisHistory: 'अभी तक कोई निदान इतिहास नहीं',
      confidence: 'विश्वास',
      
      // Carbon Shield
      carbonShield: 'कार्बन शील्ड',
      earnRewards: 'टिकाऊ खेती के लिए पुरस्कार अर्जित करें',
      sustainabilityScore: 'स्थिरता स्कोर',
      basedOnEfficiency: 'पानी की दक्षता और मिट्टी के स्वास्थ्य पर आधारित',
      waterEfficiency: 'पानी की दक्षता',
      soilHealth: 'मिट्टी का स्वास्थ्य',
      carbonCreditsEarned: 'कार्बन क्रेडिट अर्जित',
      exchangeValue: 'विनिमय मूल्य',
      exchangeCredits: 'क्रेडिट विनिमय करें',
      processing: 'प्रसंस्करण...',
      minimumCredits: 'विनिमय के लिए न्यूनतम 0.5 क्रेडिट आवश्यक',
      howItWorks: 'यह कैसे काम करता है',
      maintainMoisture: 'इष्टतम मिट्टी की नमी बनाए रखें (40-60%)',
      reduceWaste: 'कुशल सिंचाई के माध्यम से पानी की बर्बादी कम करें',
      earnCredits: '10 स्थिरता अंकों पर 1 क्रेडिट अर्जित करें',
      exchangeRate: 'विनिमय दर: 1 क्रेडिट = ₹100',
      lastUpdated: 'अंतिम अपडेट',
      
      // Market Intelligence
      realTimePrices: 'वास्तविक समय फसल की कीमतें और 7-दिन की भविष्यवाणियाँ',
      weatherScenario: 'मौसम परिदृश्य सिमुलेटर',
      weatherImpact: 'देखें कि मौसम की विसंगतियाँ फसल की कीमतों को कैसे प्रभावित करती हैं',
      normal: 'सामान्य',
      drought: 'सूखा',
      flood: 'बाढ़',
      heatwave: 'गर्मी की लहर',
      perQuintal: 'प्रति क्विंटल (100 किग्रा)',
      dayForecast: '7 दिन का पूर्वानुमान',
      marketInsights: 'बाज़ार अंतर्दृष्टि',
      droughtImpact: 'सूखे का प्रभाव: चावल और मक्का जैसी पानी-गहन फसलें आपूर्ति में कमी की उम्मीदों के कारण बढ़ती कीमत के रुझान दिखाती हैं।',
      floodImpact: 'बाढ़ का प्रभाव: अत्यधिक वर्षा खड़ी फसलों को नुकसान पहुंचा सकती है, जिससे आपूर्ति की चिंता और कीमतों में वृद्धि होती है।',
      heatwaveImpact: 'गर्मी की लहर का प्रभाव: अत्यधिक तापमान फसलों पर दबाव डालता है, विशेष रूप से उपज की गुणवत्ता और बाज़ार की कीमतों को प्रभावित करता है।',
      stableMarket: 'स्थिर बाज़ार: सामान्य मौसम की स्थिति स्थिर फसल वृद्धि और स्थिर कीमत के रुझान का समर्थन करती है।',
      
      // Seed & Tool Swap
      seedToolSwapTitle: 'बीज और औज़ार विनिमय',
      peerToPeerMarketplace: 'बीज और उपकरण के लिए पीयर-टू-पीयर बाज़ार',
      addListing: 'सूची जोड़ें',
      allItems: 'सभी वस्तुएं',
      seeds: 'बीज',
      tools: 'औज़ार',
      equipment: 'उपकरण',
      forSale: 'बिक्री के लिए',
      forRent: 'किराए के लिए',
      perDay: 'प्रति दिन',
      organic: 'जैविक',
      hybrid: 'संकर',
      heirloom: 'पारंपरिक',
      available: 'उपलब्ध',
      sendRequest: 'अनुरोध भेजें',
      requestSent: 'अनुरोध भेजा गया',
      noListings: 'कोई सूची उपलब्ध नहीं',
      addFirstListing: 'पहली सूची जोड़ने वाले बनें!',
      
      // Request Dialog
      requestItem: 'वस्तु का अनुरोध करें',
      requestType: 'अनुरोध प्रकार',
      purchase: 'खरीद',
      rent: 'किराया',
      quantityNeeded: 'आवश्यक मात्रा',
      message: 'संदेश',
      optionalMessage: 'मालिक को वैकल्पिक संदेश',
      cancel: 'रद्द करें',
      submit: 'अनुरोध सबमिट करें',
      
      // Add Listing Dialog
      addNewListing: 'नई सूची जोड़ें',
      editListing: 'सूची संपादित करें',
      title: 'शीर्षक',
      description: 'विवरण',
      category: 'श्रेणी',
      seed: 'बीज',
      tool: 'औज़ार',
      equipmentItem: 'उपकरण',
      seedType: 'बीज प्रकार',
      quantity: 'मात्रा',
      pricePerUnit: 'प्रति इकाई मूल्य (₹)',
      rentalPrice: 'प्रति दिन किराया मूल्य (₹)',
      locationField: 'स्थान',
      save: 'सहेजें',
      
      // Notifications
      notifications: 'सूचनाएं',
      noNotifications: 'कोई सूचना नहीं',
      newRequest: 'नया अनुरोध प्राप्त हुआ',
      requestMessage: 'आपकी सूची के लिए एक नया {{type}} अनुरोध है।',
      
      // Common
      loading: 'लोड हो रहा है...',
      error: 'त्रुटि',
      success: 'सफलता',
      close: 'बंद करें',
      delete: 'हटाएं',
      edit: 'संपादित करें',
      view: 'देखें',
      back: 'वापस',
      next: 'अगला',
      previous: 'पिछला',
      search: 'खोजें',
      filter: 'फ़िल्टर',
      sort: 'क्रमबद्ध करें',
      
      // Offline Mode
      offline: 'ऑफ़लाइन',
      online: 'ऑनलाइन',
      offlineMode: 'आप वर्तमान में ऑफ़लाइन हैं',
      offlineMessage: 'कुछ सुविधाएं सीमित हो सकती हैं। कनेक्शन बहाल होने पर डेटा सिंक हो जाएगा।',
      syncPending: 'सिंक लंबित',
      syncing: 'सिंक हो रहा है...',
      syncComplete: 'सिंक पूर्ण',
      
      // Financial
      financial: 'वित्तीय प्रबंधन',
      financialDesc: 'बीमा, खर्च और लाभप्रदता प्रबंधित करें',
      walletBalance: 'वॉलेट बैलेंस',
      microInsurance: 'सूक्ष्म-बीमा',
      expenseTracker: 'खर्च ट्रैकर',
      profitability: 'लाभप्रदता',
    }
  },
  pa: {
    translation: {
      // Navigation
      dashboard: 'ਡੈਸ਼ਬੋਰਡ',
      marketplace: 'ਬਾਜ਼ਾਰ',
      marketIntelligence: 'ਬਾਜ਼ਾਰ ਜਾਣਕਾਰੀ',
      seedToolSwap: 'ਬੀਜ ਅਤੇ ਔਜ਼ਾਰ ਵਟਾਂਦਰਾ',
      
      // Dashboard
      farmStatus: 'ਖੇਤ ਦੀ ਸਥਿਤੀ',
      optimal: 'ਅਨੁਕੂਲ',
      critical: 'ਗੰਭੀਰ',
      welcomeMessage: 'ਜੀ ਆਇਆਂ ਨੂੰ, ਕਿਸਾਨ ਸਿੰਘ। ਸਾਰੇ ਸਿਸਟਮ ਸਧਾਰਨ ਤੌਰ ਤੇ ਕੰਮ ਕਰ ਰਹੇ ਹਨ। ਤੁਹਾਡੀ ਕਣਕ ਦੀ ਪੈਦਾਵਾਰ ਦਾ ਅਨੁਮਾਨ ਇਸ ਸੀਜ਼ਨ ਵਿੱਚ 12% ਵਧਿਆ ਹੈ।',
      welcomeCritical: 'ਜੀ ਆਇਆਂ ਨੂੰ, ਕਿਸਾਨ ਸਿੰਘ। ਸਿੰਚਾਈ ਲਈ ਤੁਰੰਤ ਕਾਰਵਾਈ ਦੀ ਲੋੜ ਹੈ।',
      healthyCrops: 'ਸਿਹਤਮੰਦ ਫਸਲਾਂ',
      needsAttention: 'ਧਿਆਨ ਚਾਹੀਦਾ ਹੈ',
      optimalSunlight: 'ਅਨੁਕੂਲ ਧੁੱਪ',
      simulateSensor: 'ਸੈਂਸਰ ਸਿਮੂਲੇਟ ਕਰੋ',
      simulating: 'ਸਿਮੂਲੇਟ ਹੋ ਰਿਹਾ ਹੈ...',
      
      // Critical Alert
      criticalAlert: 'ਗੰਭੀਰ: ਸਿੰਚਾਈ ਲੋੜੀਂਦੀ',
      criticalMessage: 'ਮਿੱਟੀ ਦੀ ਨਮੀ {{moisture}}% ਤੇ ਬਹੁਤ ਘੱਟ ਹੈ। ਫਸਲ ਨੂੰ ਨੁਕਸਾਨ ਤੋਂ ਬਚਾਉਣ ਲਈ ਤੁਰੰਤ ਸਿੰਚਾਈ ਦੀ ਲੋੜ ਹੈ।',
      
      // Climate Widget
      realTimeMicroClimate: 'ਅਸਲ ਸਮਾਂ ਸੂਖਮ-ਜਲਵਾਯੂ - ਪੰਜਾਬ ਖੇਤਰ',
      temperature: 'ਤਾਪਮਾਨ',
      humidity: 'ਨਮੀ',
      soilMoisture: 'ਮਿੱਟੀ ਦੀ ਨਮੀ',
      
      // Soil Health
      soilHealthMonitor: 'ਮਿੱਟੀ ਸਿਹਤ ਮਾਨੀਟਰ - ਸਥਾਨਕ ਪਿੰਡ',
      noSensorData: 'ਪਿਛਲੇ ਘੰਟੇ ਵਿੱਚ ਕੋਈ ਸੈਂਸਰ ਡੇਟਾ ਉਪਲਬਧ ਨਹੀਂ',
      clickSimulate: 'ਡੇਟਾ ਤਿਆਰ ਕਰਨ ਲਈ "ਸੈਂਸਰ ਸਿਮੂਲੇਟ ਕਰੋ" ਤੇ ਕਲਿੱਕ ਕਰੋ',
      location: 'ਸਥਾਨ',
      status: 'ਸਥਿਤੀ',
      criticalStatus: 'ਗੰਭੀਰ',
      lowStatus: 'ਘੱਟ',
      mediumStatus: 'ਮੱਧਮ',
      goodStatus: 'ਚੰਗਾ',
      excellentStatus: 'ਸ਼ਾਨਦਾਰ',
      
      // Plant Doctor
      plantDoctor: 'ਪੌਦਾ ਡਾਕਟਰ',
      aiPoweredDiagnosis: 'AI-ਸੰਚਾਲਿਤ ਰੋਗ ਪਛਾਣ ਅਤੇ ਇਲਾਜ',
      uploadLeafPhoto: 'ਪੱਤੇ ਦੀ ਫੋਟੋ ਅੱਪਲੋਡ ਕਰੋ',
      uploadPrompt: 'ਰੋਗਾਂ ਦਾ ਪਤਾ ਲਗਾਉਣ ਅਤੇ ਇਲਾਜ ਦੀਆਂ ਸਿਫਾਰਸ਼ਾਂ ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ ਆਪਣੇ ਪੌਦੇ ਦੇ ਪੱਤੇ ਦੀ ਫੋਟੋ ਅੱਪਲੋਡ ਕਰੋ',
      analyzingImage: 'ਪੱਤੇ ਦੀ ਤਸਵੀਰ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਹੋ ਰਿਹਾ ਹੈ...',
      mayTakeTime: 'ਇਸ ਵਿੱਚ 30 ਸਕਿੰਟ ਤੱਕ ਦਾ ਸਮਾਂ ਲੱਗ ਸਕਦਾ ਹੈ',
      diagnosisComplete: 'ਨਿਦਾਨ ਪੂਰਾ',
      analyzeAnother: 'ਦੂਜਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ',
      newUpload: 'ਨਵਾਂ ਅੱਪਲੋਡ',
      history: 'ਇਤਿਹਾਸ',
      diagnosisHistory: 'ਨਿਦਾਨ ਇਤਿਹਾਸ',
      noDiagnosisHistory: 'ਅਜੇ ਤੱਕ ਕੋਈ ਨਿਦਾਨ ਇਤਿਹਾਸ ਨਹੀਂ',
      confidence: 'ਵਿਸ਼ਵਾਸ',
      
      // Carbon Shield
      carbonShield: 'ਕਾਰਬਨ ਸ਼ੀਲਡ',
      earnRewards: 'ਟਿਕਾਊ ਖੇਤੀ ਲਈ ਇਨਾਮ ਕਮਾਓ',
      sustainabilityScore: 'ਸਥਿਰਤਾ ਸਕੋਰ',
      basedOnEfficiency: 'ਪਾਣੀ ਦੀ ਕੁਸ਼ਲਤਾ ਅਤੇ ਮਿੱਟੀ ਦੀ ਸਿਹਤ ਤੇ ਆਧਾਰਿਤ',
      waterEfficiency: 'ਪਾਣੀ ਦੀ ਕੁਸ਼ਲਤਾ',
      soilHealth: 'ਮਿੱਟੀ ਦੀ ਸਿਹਤ',
      carbonCreditsEarned: 'ਕਾਰਬਨ ਕ੍ਰੈਡਿਟ ਕਮਾਏ',
      exchangeValue: 'ਵਟਾਂਦਰਾ ਮੁੱਲ',
      exchangeCredits: 'ਕ੍ਰੈਡਿਟ ਵਟਾਂਦਰਾ ਕਰੋ',
      processing: 'ਪ੍ਰੋਸੈਸਿੰਗ...',
      minimumCredits: 'ਵਟਾਂਦਰੇ ਲਈ ਘੱਟੋ-ਘੱਟ 0.5 ਕ੍ਰੈਡਿਟ ਲੋੜੀਂਦੇ ਹਨ',
      howItWorks: 'ਇਹ ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ',
      maintainMoisture: 'ਅਨੁਕੂਲ ਮਿੱਟੀ ਦੀ ਨਮੀ ਬਣਾਈ ਰੱਖੋ (40-60%)',
      reduceWaste: 'ਕੁਸ਼ਲ ਸਿੰਚਾਈ ਦੁਆਰਾ ਪਾਣੀ ਦੀ ਬਰਬਾਦੀ ਘਟਾਓ',
      earnCredits: '10 ਸਥਿਰਤਾ ਅੰਕਾਂ ਤੇ 1 ਕ੍ਰੈਡਿਟ ਕਮਾਓ',
      exchangeRate: 'ਵਟਾਂਦਰਾ ਦਰ: 1 ਕ੍ਰੈਡਿਟ = ₹100',
      lastUpdated: 'ਆਖਰੀ ਅੱਪਡੇਟ',
      
      // Market Intelligence
      realTimePrices: 'ਅਸਲ ਸਮਾਂ ਫਸਲ ਦੀਆਂ ਕੀਮਤਾਂ ਅਤੇ 7-ਦਿਨ ਦੀਆਂ ਭਵਿੱਖਬਾਣੀਆਂ',
      weatherScenario: 'ਮੌਸਮ ਦ੍ਰਿਸ਼ ਸਿਮੂਲੇਟਰ',
      weatherImpact: 'ਦੇਖੋ ਕਿ ਮੌਸਮ ਦੀਆਂ ਵਿਸੰਗਤੀਆਂ ਫਸਲ ਦੀਆਂ ਕੀਮਤਾਂ ਨੂੰ ਕਿਵੇਂ ਪ੍ਰਭਾਵਿਤ ਕਰਦੀਆਂ ਹਨ',
      normal: 'ਸਧਾਰਨ',
      drought: 'ਸੋਕਾ',
      flood: 'ਹੜ੍ਹ',
      heatwave: 'ਗਰਮੀ ਦੀ ਲਹਿਰ',
      perQuintal: 'ਪ੍ਰਤੀ ਕੁਇੰਟਲ (100 ਕਿਲੋ)',
      dayForecast: '7 ਦਿਨ ਦਾ ਪੂਰਵ-ਅਨੁਮਾਨ',
      marketInsights: 'ਬਾਜ਼ਾਰ ਸੂਝ',
      droughtImpact: 'ਸੋਕੇ ਦਾ ਪ੍ਰਭਾਵ: ਚਾਵਲ ਅਤੇ ਮੱਕੀ ਵਰਗੀਆਂ ਪਾਣੀ-ਗਹਿਣ ਫਸਲਾਂ ਸਪਲਾਈ ਵਿੱਚ ਕਮੀ ਦੀਆਂ ਉਮੀਦਾਂ ਕਾਰਨ ਵਧਦੀ ਕੀਮਤ ਦੇ ਰੁਝਾਨ ਦਿਖਾਉਂਦੀਆਂ ਹਨ।',
      floodImpact: 'ਹੜ੍ਹ ਦਾ ਪ੍ਰਭਾਵ: ਜ਼ਿਆਦਾ ਬਾਰਿਸ਼ ਖੜ੍ਹੀਆਂ ਫਸਲਾਂ ਨੂੰ ਨੁਕਸਾਨ ਪਹੁੰਚਾ ਸਕਦੀ ਹੈ, ਜਿਸ ਨਾਲ ਸਪਲਾਈ ਦੀ ਚਿੰਤਾ ਅਤੇ ਕੀਮਤਾਂ ਵਿੱਚ ਵਾਧਾ ਹੁੰਦਾ ਹੈ।',
      heatwaveImpact: 'ਗਰਮੀ ਦੀ ਲਹਿਰ ਦਾ ਪ੍ਰਭਾਵ: ਬਹੁਤ ਜ਼ਿਆਦਾ ਤਾਪਮਾਨ ਫਸਲਾਂ ਤੇ ਦਬਾਅ ਪਾਉਂਦਾ ਹੈ, ਖਾਸ ਤੌਰ ਤੇ ਪੈਦਾਵਾਰ ਦੀ ਗੁਣਵੱਤਾ ਅਤੇ ਬਾਜ਼ਾਰ ਦੀਆਂ ਕੀਮਤਾਂ ਨੂੰ ਪ੍ਰਭਾਵਿਤ ਕਰਦਾ ਹੈ।',
      stableMarket: 'ਸਥਿਰ ਬਾਜ਼ਾਰ: ਸਧਾਰਨ ਮੌਸਮ ਦੀਆਂ ਸਥਿਤੀਆਂ ਸਥਿਰ ਫਸਲ ਵਾਧੇ ਅਤੇ ਸਥਿਰ ਕੀਮਤ ਦੇ ਰੁਝਾਨ ਦਾ ਸਮਰਥਨ ਕਰਦੀਆਂ ਹਨ।',
      
      // Seed & Tool Swap
      seedToolSwapTitle: 'ਬੀਜ ਅਤੇ ਔਜ਼ਾਰ ਵਟਾਂਦਰਾ',
      peerToPeerMarketplace: 'ਬੀਜ ਅਤੇ ਉਪਕਰਣਾਂ ਲਈ ਪੀਅਰ-ਟੂ-ਪੀਅਰ ਬਾਜ਼ਾਰ',
      addListing: 'ਸੂਚੀ ਸ਼ਾਮਲ ਕਰੋ',
      allItems: 'ਸਾਰੀਆਂ ਚੀਜ਼ਾਂ',
      seeds: 'ਬੀਜ',
      tools: 'ਔਜ਼ਾਰ',
      equipment: 'ਉਪਕਰਣ',
      forSale: 'ਵਿਕਰੀ ਲਈ',
      forRent: 'ਕਿਰਾਏ ਲਈ',
      perDay: 'ਪ੍ਰਤੀ ਦਿਨ',
      organic: 'ਜੈਵਿਕ',
      hybrid: 'ਸੰਕਰ',
      heirloom: 'ਪਰੰਪਰਾਗਤ',
      available: 'ਉਪਲਬਧ',
      sendRequest: 'ਬੇਨਤੀ ਭੇਜੋ',
      requestSent: 'ਬੇਨਤੀ ਭੇਜੀ ਗਈ',
      noListings: 'ਕੋਈ ਸੂਚੀ ਉਪਲਬਧ ਨਹੀਂ',
      addFirstListing: 'ਪਹਿਲੀ ਸੂਚੀ ਸ਼ਾਮਲ ਕਰਨ ਵਾਲੇ ਬਣੋ!',
      
      // Request Dialog
      requestItem: 'ਚੀਜ਼ ਦੀ ਬੇਨਤੀ ਕਰੋ',
      requestType: 'ਬੇਨਤੀ ਕਿਸਮ',
      purchase: 'ਖਰੀਦ',
      rent: 'ਕਿਰਾਇਆ',
      quantityNeeded: 'ਲੋੜੀਂਦੀ ਮਾਤਰਾ',
      message: 'ਸੁਨੇਹਾ',
      optionalMessage: 'ਮਾਲਕ ਨੂੰ ਵਿਕਲਪਿਕ ਸੁਨੇਹਾ',
      cancel: 'ਰੱਦ ਕਰੋ',
      submit: 'ਬੇਨਤੀ ਜਮ੍ਹਾਂ ਕਰੋ',
      
      // Add Listing Dialog
      addNewListing: 'ਨਵੀਂ ਸੂਚੀ ਸ਼ਾਮਲ ਕਰੋ',
      editListing: 'ਸੂਚੀ ਸੰਪਾਦਿਤ ਕਰੋ',
      title: 'ਸਿਰਲੇਖ',
      description: 'ਵੇਰਵਾ',
      category: 'ਸ਼੍ਰੇਣੀ',
      seed: 'ਬੀਜ',
      tool: 'ਔਜ਼ਾਰ',
      equipmentItem: 'ਉਪਕਰਣ',
      seedType: 'ਬੀਜ ਕਿਸਮ',
      quantity: 'ਮਾਤਰਾ',
      pricePerUnit: 'ਪ੍ਰਤੀ ਯੂਨਿਟ ਕੀਮਤ (₹)',
      rentalPrice: 'ਪ੍ਰਤੀ ਦਿਨ ਕਿਰਾਇਆ ਕੀਮਤ (₹)',
      locationField: 'ਸਥਾਨ',
      save: 'ਸੁਰੱਖਿਅਤ ਕਰੋ',
      
      // Notifications
      notifications: 'ਸੂਚਨਾਵਾਂ',
      noNotifications: 'ਕੋਈ ਸੂਚਨਾ ਨਹੀਂ',
      newRequest: 'ਨਵੀਂ ਬੇਨਤੀ ਪ੍ਰਾਪਤ ਹੋਈ',
      requestMessage: 'ਤੁਹਾਡੀ ਸੂਚੀ ਲਈ ਇੱਕ ਨਵੀਂ {{type}} ਬੇਨਤੀ ਹੈ।',
      
      // Common
      loading: 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...',
      error: 'ਗਲਤੀ',
      success: 'ਸਫਲਤਾ',
      close: 'ਬੰਦ ਕਰੋ',
      delete: 'ਮਿਟਾਓ',
      edit: 'ਸੰਪਾਦਿਤ ਕਰੋ',
      view: 'ਦੇਖੋ',
      back: 'ਵਾਪਸ',
      next: 'ਅਗਲਾ',
      previous: 'ਪਿਛਲਾ',
      search: 'ਖੋਜੋ',
      filter: 'ਫਿਲਟਰ',
      sort: 'ਕ੍ਰਮਬੱਧ ਕਰੋ',
      
      // Offline Mode
      offline: 'ਔਫਲਾਈਨ',
      online: 'ਔਨਲਾਈਨ',
      offlineMode: 'ਤੁਸੀਂ ਵਰਤਮਾਨ ਵਿੱਚ ਔਫਲਾਈਨ ਹੋ',
      offlineMessage: 'ਕੁਝ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ ਸੀਮਤ ਹੋ ਸਕਦੀਆਂ ਹਨ। ਕਨੈਕਸ਼ਨ ਬਹਾਲ ਹੋਣ ਤੇ ਡੇਟਾ ਸਿੰਕ ਹੋ ਜਾਵੇਗਾ।',
      syncPending: 'ਸਿੰਕ ਲੰਬਿਤ',
      syncing: 'ਸਿੰਕ ਹੋ ਰਿਹਾ ਹੈ...',
      syncComplete: 'ਸਿੰਕ ਪੂਰਾ',
      
      // Financial
      financial: 'ਵਿੱਤੀ ਪ੍ਰਬੰਧਨ',
      financialDesc: 'ਬੀਮਾ, ਖਰਚੇ ਅਤੇ ਲਾਭਕਾਰੀਤਾ ਪ੍ਰਬੰਧਿਤ ਕਰੋ',
      walletBalance: 'ਵਾਲਿਟ ਬੈਲੇਂਸ',
      microInsurance: 'ਸੂਖਮ-ਬੀਮਾ',
      expenseTracker: 'ਖਰਚਾ ਟਰੈਕਰ',
      profitability: 'ਲਾਭਕਾਰੀਤਾ',
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
