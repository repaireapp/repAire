import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Linking, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C } from '../constants/colors';

interface Props {
  onSelect: (vehicle: string) => void;
  isPremium: boolean;
  onTogglePremium: () => void;
}

export default function HomeScreen({ onSelect, isPremium, onTogglePremium }: Props) {
  const handleContact = () => {
    Linking.openURL('mailto:repaire.app@gmail.com?subject=Feedback repAire');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      {/* HEADER */}
      <View style={s.header}>
        <Image source={require('../../assets/images/logo.png')} style={s.logo} />
        <Text style={s.logoText}>repAire</Text>
        <Text style={s.subtitle}>Le mécano IA dans ta poche</Text>

        <TouchableOpacity onPress={handleContact} style={s.contactBtn}>
          <Ionicons name="chatbubbles-outline" size={16} color={C.teal} />
          <Text style={s.contactText}>Avis / Bug ?</Text>
        </TouchableOpacity>
      </View>

      {/* CONTENT */}
      <View style={{ flex: 1, width: '100%' }}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10 }} showsVerticalScrollIndicator={false}>
          <Text style={s.sectionTitle}>QUEL VÉHICULE EST EN PANNE ?</Text>
          <View style={s.cards}>
            <TouchableOpacity style={s.card} onPress={() => onSelect('Bike')}>
              <Ionicons name="bicycle" size={48} color={C.teal} />
              <Text style={s.cardText}>Vélo (Classique/VAE)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={s.card} onPress={() => onSelect('Scooter')}>
              <Ionicons name="flash" size={48} color={C.yellow} />
              <Text style={s.cardText}>Trottinette Élec.</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[s.card, { opacity: 0.4 }]} disabled>
              <Ionicons name="car-outline" size={48} color={C.textMuted} />
              <Text style={[s.cardText, { color: C.textDim }]}>Moto (Bientôt)</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* FOOTER */}
      <View style={s.footer}>
        {/* Codex */}
        <View style={{ marginBottom: 0 }}>
          <Text style={[s.sectionLabel, { marginBottom: 4 }]}>MANUEL UNIVERSEL</Text>
          <TouchableOpacity style={s.codexBanner} onPress={() => onSelect('Codex')}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={s.codexIcon}>
                <Ionicons name={isPremium ? 'book-outline' : 'lock-closed'} size={22} color={C.orange} />
              </View>
              <View>
                <Text style={s.codexTitle}>OUVRIR LE CODEX</Text>
                <Text style={s.codexSub}>{isPremium ? 'Accès illimité' : 'Débloquer'}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={C.border} />
          </TouchableOpacity>
        </View>

        {/* Maintenance */}
        <TouchableOpacity style={s.maintenanceBtn} onPress={() => onSelect('Maintenance')}>
          <View style={s.maintenanceIcon}>
            <Ionicons name="calendar-outline" size={20} color={C.teal} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>Carnet d'Entretien</Text>
            <Text style={{ color: C.textMuted, fontSize: 10 }}>Suivi des révisions</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={C.textDim} />
        </TouchableOpacity>

        {/* Admin toggle */}
        <TouchableOpacity onPress={onTogglePremium} style={{ alignSelf: 'center', marginTop: 8 }}>
          <Text style={{ color: C.border, fontSize: 9 }}>[ADMIN] Mode : {isPremium ? 'PREMIUM' : 'GRATUIT'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  header: {
    width: '100%', alignItems: 'center', justifyContent: 'center',
    paddingTop: 15, paddingBottom: 10, position: 'relative',
  },
  logo: { width: 50, height: 50, resizeMode: 'contain', marginBottom: 5 },
  logoText: {
    fontSize: 56, fontWeight: '900', color: C.tealDark, letterSpacing: 1,
    textShadowColor: 'rgba(56, 178, 172, 0.3)', textShadowOffset: { width: 0, height: 4 }, textShadowRadius: 10,
  },
  subtitle: { fontSize: 14, color: C.textMuted, marginTop: 5, letterSpacing: 1 },
  contactBtn: {
    position: 'absolute', right: 20, top: 25,
    backgroundColor: C.card, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20,
    borderWidth: 1, borderColor: C.border, flexDirection: 'row', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, elevation: 3,
  },
  contactText: { color: C.textMuted, fontSize: 10, fontWeight: 'bold', marginLeft: 6 },
  sectionTitle: {
    fontSize: 16, fontWeight: 'bold', color: C.text, marginTop: 10, marginBottom: 15,
    textAlign: 'center', letterSpacing: 1, textTransform: 'uppercase',
  },
  sectionLabel: { color: C.textDim, fontSize: 10, fontWeight: 'bold', letterSpacing: 1, textTransform: 'uppercase' },
  cards: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 10 },
  card: {
    backgroundColor: C.card, width: '48%', aspectRatio: 1, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center', marginVertical: 10,
    borderWidth: 1, borderColor: C.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 5,
  },
  cardText: { color: C.text, marginTop: 15, fontWeight: '700', textAlign: 'center', fontSize: 13 },
  footer: {
    paddingHorizontal: 20, paddingVertical: 10,
    paddingBottom: Platform.OS === 'android' ? 40 : 20,
    backgroundColor: C.bg, borderTopWidth: 1, borderTopColor: C.card,
  },
  codexBanner: {
    backgroundColor: C.card, borderRadius: 15, paddingVertical: 8, paddingHorizontal: 20,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1, borderColor: C.orange,
    shadowColor: C.orange, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, elevation: 3,
  },
  codexIcon: { backgroundColor: 'rgba(237, 137, 54, 0.2)', padding: 6, borderRadius: 8, marginRight: 10 },
  codexTitle: { color: C.orange, fontWeight: 'bold', fontSize: 14, letterSpacing: 1 },
  codexSub: { color: C.textMuted, fontSize: 10, marginTop: 2 },
  maintenanceBtn: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, width: '100%',
    paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12, marginTop: 8,
    borderWidth: 1, borderColor: C.border,
  },
  maintenanceIcon: { backgroundColor: 'rgba(79, 209, 197, 0.2)', padding: 6, borderRadius: 8, marginRight: 10 },
});
