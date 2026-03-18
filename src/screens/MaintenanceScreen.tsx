import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, BackHandler, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { C } from '../constants/colors';
import {
  MaintenanceService,
  type TaskStatus,
  type UserMaintenanceProfile,
  type VehicleType,
} from '../services/maintenanceService';

interface Props {
  onBack: () => void;
  onOpenCodex: (target: string) => void;
}

export default function MaintenanceScreen({ onBack, onOpenCodex }: Props) {
  const [garage, setGarage] = useState<UserMaintenanceProfile[]>([]);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showGarage, setShowGarage] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);
  const [showRename, setShowRename] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [tempName, setTempName] = useState('');

  useEffect(() => { loadData(); }, []);

  // Android back handler
  useEffect(() => {
    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (showGarage || showSuccess || showNewForm || showRename || showDelete) {
        setShowGarage(false); setShowSuccess(false); setShowNewForm(false);
        setShowRename(false); setShowDelete(false);
        return true;
      }
      onBack();
      return true;
    });
    return () => handler.remove();
  }, [showGarage, showSuccess, showNewForm, showRename, showDelete]);

  const loadData = async () => {
    const data = await MaintenanceService.loadGarage();
    setGarage(data);
    if (data.length > 0) setActiveIdx(0);
    setLoading(false);
  };

  const checkLimitAndOpenForm = () => {
    setShowGarage(false);
    setShowNewForm(true);
  };

  const handleCreate = async (type: VehicleType, name: string) => {
    if (garage.find(v => v.vehicleName === name)) {
      Alert.alert('Nom déjà pris', 'Choisis un autre nom.');
      return;
    }
    const profile = MaintenanceService.createProfile(type, name);
    const newGarage = [...garage, profile];
    await MaintenanceService.saveGarage(newGarage);
    setGarage(newGarage);
    setActiveIdx(newGarage.length - 1);
    setShowNewForm(false);
  };

  const handleCheckTask = async (taskId: string) => {
    if (activeIdx === null) return;
    const name = garage[activeIdx].vehicleName;
    const updated = MaintenanceService.completeTask(garage, name, taskId);
    await MaintenanceService.saveGarage(updated);
    setGarage(updated);
    setShowSuccess(true);
  };

  const openDeleteModal = () => {
    if (activeIdx === null) return;
    setShowGarage(false);
    setTimeout(() => setShowDelete(true), 100);
  };

  const confirmDelete = async () => {
    if (activeIdx === null) return;
    const newGarage = garage.filter((_, i) => i !== activeIdx);
    await MaintenanceService.saveGarage(newGarage);
    setGarage(newGarage);
    setActiveIdx(newGarage.length > 0 ? 0 : null);
    setShowDelete(false);
  };

  const openRenameModal = () => {
    if (activeIdx === null) return;
    setTempName(garage[activeIdx].vehicleName);
    setShowRename(true);
  };

  const confirmRename = async () => {
    if (!tempName.trim() || activeIdx === null) return;
    const old = garage[activeIdx].vehicleName;
    const updated = MaintenanceService.renameProfile(garage, old, tempName);
    await MaintenanceService.saveGarage(updated);
    setGarage(updated);
    setShowRename(false);
  };

  if (loading) {
    return <View style={s.container}><Text style={{ color: 'white' }}>Chargement...</Text></View>;
  }

  // --- NEW VEHICLE FORM ---
  if (garage.length === 0 || showNewForm) {
    return (
      <View style={s.container}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => garage.length > 0 ? setShowNewForm(false) : onBack()} style={s.backBtn}>
            <Ionicons name="arrow-back" size={24} color={C.textMuted} />
            <Text style={s.backText}>{garage.length > 0 ? 'Annuler' : 'Retour'}</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>AJOUTER UN VÉHICULE</Text>
        </View>
        <Text style={s.sectionTitle}>TYPE DE VÉHICULE ?</Text>
        <View style={s.cards}>
          <TouchableOpacity style={s.card} onPress={() => handleCreate('roadBike', 'Mon Route ' + (garage.length + 1))}>
            <Ionicons name="bicycle" size={40} color={C.teal} />
            <Text style={s.cardText}>Vélo Route / Ville</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.card} onPress={() => handleCreate('mtb', 'Mon VTT ' + (garage.length + 1))}>
            <Ionicons name="trail-sign" size={40} color={C.orange} />
            <Text style={s.cardText}>VTT / Gravel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.card} onPress={() => handleCreate('escooter', 'Ma Trott ' + (garage.length + 1))}>
            <Ionicons name="flash" size={40} color={C.yellow} />
            <Text style={s.cardText}>Trottinette</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (activeIdx === null || !garage[activeIdx]) return null;
  const active = garage[activeIdx];

  const statusInfo = (status: TaskStatus) => {
    switch (status) {
      case 'ok': return { color: C.textDim, label: 'OK' };
      case 'soon': return { color: C.yellow, label: 'Bientôt' };
      case 'late': return { color: C.red, label: 'EN RETARD' };
      case 'never': return { color: C.textMuted, label: 'JAMAIS FAIT' };
    }
  };

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={onBack} style={s.backBtn}>
          <Ionicons name="arrow-back" size={24} color={C.textMuted} />
          <Text style={s.backText}>Accueil</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowGarage(true)} style={s.garageBtn}>
          <Ionicons name={active.vehicleType === 'escooter' ? 'flash' : 'bicycle'} size={16} color={C.textMuted} />
          <Text style={s.garageBtnText}>GARAGE ({garage.length})</Text>
        </TouchableOpacity>
      </View>

      {/* Vehicle info */}
      <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
        <Text style={{ color: C.textDim, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>CARNET D'ENTRETIEN</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ color: 'white', fontSize: 28, fontWeight: 'bold', marginRight: 10 }}>{active.vehicleName}</Text>
          <TouchableOpacity onPress={openRenameModal} style={{ backgroundColor: C.card, padding: 8, borderRadius: 20 }}>
            <Ionicons name="pencil" size={16} color={C.teal} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tasks */}
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        {active.tasks.map(task => {
          const status = MaintenanceService.getStatus(task.lastDone, task.intervalDays);
          const info = statusInfo(status);
          const isOk = status === 'ok';
          const dateText = status === 'never'
            ? "Pas encore d'historique"
            : `Fait le : ${new Date(task.lastDone).toLocaleDateString()}`;

          return (
            <View key={task.id} style={[s.taskRow, { borderLeftColor: isOk ? C.teal : info.color }]}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>{task.label}</Text>
                  {status === 'late' && <Ionicons name="alert-circle" size={16} color={C.red} style={{ marginLeft: 5 }} />}
                </View>
                <Text style={{ color: C.textMuted, fontSize: 12 }}>{dateText}</Text>
                <Text style={{ color: isOk ? C.teal : info.color, fontSize: 12, fontWeight: 'bold', marginTop: 2 }}>
                  État : {info.label}
                </Text>
                {task.codexLinkId && (
                  <TouchableOpacity onPress={() => onOpenCodex(task.codexLinkId!)} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                    <Ionicons name="book-outline" size={14} color="#63B3ED" />
                    <Text style={{ color: '#63B3ED', fontSize: 12, marginLeft: 5 }}>Voir le tuto</Text>
                  </TouchableOpacity>
                )}
              </View>
              <TouchableOpacity onPress={() => handleCheckTask(task.id)} style={[s.checkBtn, {
                backgroundColor: isOk ? C.teal : 'transparent',
                borderColor: isOk ? C.teal : info.color,
              }]}>
                {status === 'never'
                  ? <Ionicons name="add" size={28} color={info.color} style={{ opacity: 0.5 }} />
                  : <Ionicons name="checkmark" size={28} color={isOk ? C.bg : info.color} style={{ opacity: isOk ? 1 : 0.5 }} />
                }
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>

      {/* Ad banner placeholder */}
      <View style={s.adBanner}>
        <View style={s.adBox}>
          <Text style={{ color: C.textDim, fontWeight: 'bold', fontSize: 10 }}>ESPACE PUB (Bannière)</Text>
        </View>
      </View>

      {/* === MODALS === */}

      {/* Success */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={s.modalOverlay}>
          <View style={s.modalBox}>
            <Ionicons name="checkmark-circle" size={50} color={C.teal} style={{ marginBottom: 15 }} />
            <Text style={s.modalTitle}>TOP !</Text>
            <TouchableOpacity style={s.modalBtn} onPress={() => setShowSuccess(false)}>
              <Text style={s.modalBtnText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Rename */}
      <Modal visible={showRename} transparent animationType="fade">
        <View style={s.modalOverlay}>
          <View style={s.modalBox}>
            <Text style={s.modalTitle}>RENOMMER</Text>
            <View style={s.renameInput}>
              <TextInput style={{ color: 'white', fontSize: 18, textAlign: 'center' }}
                value={tempName} onChangeText={setTempName} autoFocus selectTextOnFocus />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
              <TouchableOpacity onPress={() => setShowRename(false)} style={{ padding: 15 }}>
                <Text style={{ color: C.textMuted }}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmRename} style={s.validateBtn}>
                <Text style={{ color: C.bg, fontWeight: 'bold' }}>VALIDER</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete */}
      <Modal visible={showDelete} transparent animationType="fade">
        <View style={s.modalOverlay}>
          <View style={[s.modalBox, { borderColor: C.red, borderWidth: 1 }]}>
            <View style={{ backgroundColor: 'rgba(252, 129, 129, 0.2)', padding: 15, borderRadius: 50, marginBottom: 15 }}>
              <Ionicons name="warning" size={40} color={C.red} />
            </View>
            <Text style={[s.modalTitle, { color: C.red }]}>SUPPRIMER ?</Text>
            <Text style={{ color: C.text, textAlign: 'center', marginTop: 10, marginBottom: 20 }}>
              Ce carnet sera définitivement perdu.
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
              <TouchableOpacity onPress={() => setShowDelete(false)} style={{ padding: 15 }}>
                <Text style={{ color: C.textMuted }}>Non</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmDelete} style={[s.validateBtn, { backgroundColor: C.red }]}>
                <Text style={{ color: C.bg, fontWeight: 'bold' }}>OUI, SUPPRIMER</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Garage list */}
      <Modal visible={showGarage} transparent animationType="slide">
        <View style={s.modalOverlay}>
          <View style={[s.modalBox, { minHeight: '50%', maxHeight: '80%' }]}>
            <Text style={s.modalTitle}>MON GARAGE</Text>
            <Text style={{ color: C.textDim, fontSize: 12, marginBottom: 10 }}>Sélectionne un véhicule :</Text>
            <ScrollView style={{ width: '100%' }}>
              {garage.map((v, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => { setActiveIdx(i); setShowGarage(false); }}
                  style={[s.garageItem, {
                    backgroundColor: i === activeIdx ? C.teal : C.card,
                    borderColor: C.border,
                  }]}
                >
                  <View>
                    <Text style={{ color: i === activeIdx ? C.bg : 'white', fontWeight: 'bold', fontSize: 16 }}>
                      {v.vehicleName}
                    </Text>
                    <Text style={{ color: i === activeIdx ? C.card : C.textMuted, fontSize: 10 }}>
                      {v.vehicleType === 'roadBike' ? 'Vélo Route' : v.vehicleType === 'mtb' ? 'VTT' : v.vehicleType === 'cityBike' ? 'Vélo Ville' : 'Trottinette'}
                    </Text>
                  </View>
                  {i === activeIdx && <Ionicons name="checkmark-circle" size={24} color={C.bg} />}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={s.garageFooter}>
              <TouchableOpacity onPress={openDeleteModal} style={{ padding: 10 }}>
                <Ionicons name="trash" size={24} color={C.red} />
              </TouchableOpacity>
              <TouchableOpacity onPress={checkLimitAndOpenForm} style={s.addBtn}>
                <Ionicons name="add" size={20} color="white" />
                <Text style={{ color: 'white', fontWeight: 'bold', marginLeft: 5 }}>Ajouter</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => setShowGarage(false)} style={{ marginTop: 15, padding: 10 }}>
              <Text style={{ color: C.textDim }}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 10, marginBottom: 15,
  },
  backBtn: { flexDirection: 'row', alignItems: 'center' },
  backText: { color: C.textMuted, fontSize: 14, marginLeft: 5, fontWeight: '600' },
  headerTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', marginRight: 20 },
  sectionTitle: {
    fontSize: 16, fontWeight: 'bold', color: C.text, marginTop: 20,
    textAlign: 'center', letterSpacing: 1, textTransform: 'uppercase',
  },
  cards: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 10 },
  card: {
    backgroundColor: C.card, width: '48%', aspectRatio: 1, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center', marginVertical: 10,
    borderWidth: 1, borderColor: C.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, elevation: 5,
  },
  cardText: { color: C.text, marginTop: 15, fontWeight: '700', textAlign: 'center', fontSize: 13 },
  garageBtn: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: C.card,
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
    borderWidth: 1, borderColor: C.border,
  },
  garageBtnText: { color: C.textMuted, marginLeft: 5, fontSize: 12, fontWeight: 'bold' },
  taskRow: {
    backgroundColor: C.card, borderRadius: 16, padding: 20, marginBottom: 15,
    borderLeftWidth: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  checkBtn: {
    width: 50, height: 50, borderRadius: 25,
    justifyContent: 'center', alignItems: 'center', borderWidth: 2,
  },
  adBanner: {
    width: '100%', backgroundColor: C.darkest, borderTopWidth: 1, borderTopColor: C.card,
    paddingVertical: 10, alignItems: 'center', justifyContent: 'center',
    position: 'absolute', bottom: 0, left: 0, right: 0,
  },
  adBox: {
    width: 320, height: 50, backgroundColor: C.card, justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: C.border, borderStyle: 'dashed',
  },
  // Modals
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
  modalBox: {
    width: '85%', backgroundColor: C.bg, borderRadius: 20, padding: 25,
    alignItems: 'center', borderWidth: 1, borderColor: C.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, elevation: 10,
  },
  modalTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', letterSpacing: 1 },
  modalBtn: {
    backgroundColor: C.tealDark, width: '80%', paddingVertical: 15,
    borderRadius: 50, alignItems: 'center', marginTop: 15,
  },
  modalBtnText: { color: C.bg, fontSize: 18, fontWeight: 'bold' },
  renameInput: {
    backgroundColor: C.card, width: '100%', borderRadius: 10,
    borderWidth: 1, borderColor: C.border, padding: 10, marginBottom: 20, marginTop: 10,
  },
  validateBtn: { backgroundColor: C.teal, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20 },
  garageItem: {
    padding: 15, borderRadius: 12, marginBottom: 10,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderWidth: 1,
  },
  garageFooter: {
    flexDirection: 'row', marginTop: 20, width: '100%',
    justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 10, borderTopWidth: 1, borderTopColor: C.border,
  },
  addBtn: {
    backgroundColor: C.orange, paddingHorizontal: 20, paddingVertical: 10,
    borderRadius: 20, flexDirection: 'row', alignItems: 'center',
  },
});
