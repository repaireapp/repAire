import * as Speech from 'expo-speech';
import React, { useEffect, useState } from 'react';
import { BackHandler, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AdModal from '../../src/components/AdModal';
import DisclaimerModal from '../../src/components/DisclaimerModal';
import { C } from '../../src/constants/colors';
import CodexScreen from '../../src/screens/CodexScreen';
import DiagnosticResultScreen from '../../src/screens/DiagnosticResultScreen';
import DiagnosticScreen from '../../src/screens/DiagnosticScreen';
import HomeScreen from '../../src/screens/HomeScreen';
import MaintenanceScreen from '../../src/screens/MaintenanceScreen';

export default function Index() {
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [iaResult, setIaResult] = useState<string | null>(null);
  const [codexStartView, setCodexStartView] = useState('global');
  const [isPremium, setIsPremium] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const [pendingCodexTarget, setPendingCodexTarget] = useState<string | null>(null);

  // Android back button
  useEffect(() => {
    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
      Speech.stop();
      if (iaResult) { setIaResult(null); return true; }
      if (selectedVehicle) {
        setSelectedVehicle(null);
        setCodexStartView('global');
        return true;
      }
      return false; // exit app
    });
    return () => handler.remove();
  }, [selectedVehicle, iaResult]);

  // Open codex directly (from diagnostic result or maintenance)
  const openCodexDirectly = (target: string) => {
    setCodexStartView(target);
    setSelectedVehicle('Codex');
  };

  // Vehicle selection handler
  const handleSelect = (vehicle: string) => {
    if (vehicle === 'Maintenance') { setSelectedVehicle('Maintenance'); return; }
    if (vehicle === 'Codex') {
      if (isPremium) {
        setCodexStartView('menu');
        setSelectedVehicle('Codex');
      } else {
        setPendingCodexTarget('menu');
        setShowAd(true);
      }
      return;
    }
    setSelectedVehicle(vehicle);
  };

  // After ad finishes
  const onAdComplete = () => {
    setShowAd(false);
    if (pendingCodexTarget) {
      setCodexStartView(pendingCodexTarget);
      setSelectedVehicle('Codex');
      setPendingCodexTarget(null);
    }
  };

  // --- RENDER ---
  const renderScreen = () => {
    if (selectedVehicle === 'Maintenance') {
      return (
        <MaintenanceScreen
          onBack={() => setSelectedVehicle(null)}
          onOpenCodex={openCodexDirectly}
          isPremium={isPremium}
        />
      );
    }
    if (selectedVehicle === 'Codex') {
      return (
        <CodexScreen
          onBack={() => setSelectedVehicle(null)}
          initialView={codexStartView}
        />
      );
    }
    if (iaResult) {
      return (
        <DiagnosticResultScreen
          result={iaResult}
          vehicleType={selectedVehicle || 'Bike'}
          onBack={() => setIaResult(null)}
          onOpenCodex={openCodexDirectly}
        />
      );
    }
    if (!selectedVehicle) {
      return (
        <HomeScreen
          onSelect={handleSelect}
          isPremium={isPremium}
          onTogglePremium={() => setIsPremium(!isPremium)}
        />
      );
    }
    if (selectedVehicle === 'Bike' || selectedVehicle === 'Scooter') {
      return (
        <DiagnosticScreen
          vehicleType={selectedVehicle as 'Bike' | 'Scooter'}
          onBack={() => setSelectedVehicle(null)}
          onResult={setIaResult}
        />
      );
    }
    return null;
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
        <StatusBar barStyle="light-content" backgroundColor={C.bg} translucent={false} />
        {renderScreen()}
        <DisclaimerModal />
        <AdModal visible={showAd} label="Publicité Partenaire" onComplete={onAdComplete} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
