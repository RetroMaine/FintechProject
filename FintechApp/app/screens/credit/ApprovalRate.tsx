/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  Modal,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

// ─── Types ────────────────────────────────────────────────────────────
interface Loan {
  id: string;          // uuid
  name: string;        // “Auto Loan”, “Mortgage” …
  principal: number;   // $
  interest: number;    // APR %
  term: number;        // months
}

// ─── Helpers ──────────────────────────────────────────────────────────
const uuid = () => Math.random().toString(36).slice(2, 9); // simple id

const STORAGE_KEY = 'loans';

// ─── Component ────────────────────────────────────────────────────────
const LoanDashboard = () => {
  const router = useRouter();

  const [loans, setLoans] = useState<Loan[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId]   = useState<string | null>(null);
  const [form, setForm]             = useState({
    name: '',
    principal: '',
    interest: '',
    term: '',
  });

  // ░░ Load on mount
  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) setLoans(JSON.parse(raw));
    })();
  }, []);

  // ░░ Persist whenever loans change
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(loans));
  }, [loans]);

  // ── CRUD handlers ──────────────────────────────────────────────────
  const resetForm = () => {
    setForm({ name: '', principal: '', interest: '', term: '' });
    setEditingId(null);
  };

  const openNewLoanModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const saveLoan = () => {
    // basic validation
    if (!form.name.trim()) { Alert.alert('Please enter a loan name'); return; }

    const newLoan: Loan = {
      id: editingId ?? uuid(),
      name: form.name.trim(),
      principal: parseFloat(form.principal) || 0,
      interest: parseFloat(form.interest) || 0,
      term: parseInt(form.term, 10)        || 0,
    };

    setLoans(prev =>
      editingId
        ? prev.map(l => (l.id === editingId ? newLoan : l))
        : [...prev, newLoan],
    );

    setModalVisible(false);
    resetForm();
  };

  const editLoan = (loan: Loan) => {
    setForm({
      name:       loan.name,
      principal:  loan.principal.toString(),
      interest:   loan.interest.toString(),
      term:       loan.term.toString(),
    });
    setEditingId(loan.id);
    setModalVisible(true);
  };

  const deleteLoan = (id: string) => {
    Alert.alert('Delete loan?', 'This cannot be undone.', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => setLoans(prev => prev.filter(l => l.id !== id)),
      },
    ]);
  };

  // ── Render ──────────────────────────────────────────────────────────
  const renderLoan = ({ item }: { item: Loan }) => (
    <TouchableOpacity
      onPress={() => editLoan(item)}
      style={styles.loanCard}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.loanName}>{item.name}</Text>
        <Text style={styles.loanDetail}>
          ${item.principal.toLocaleString()} • {item.interest}% APR • {item.term} mo
        </Text>
      </View>

      <TouchableOpacity onPress={() => deleteLoan(item.id)}>
        <Text style={styles.delete}>✕</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.h1}>My Loans</Text>

      {loans.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 40, color: '#666' }}>
          No loans yet — add one below.
        </Text>
      ) : (
        <FlatList
          data={loans}
          keyExtractor={l => l.id}
          renderItem={renderLoan}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}

      {/* Add / Edit button */}
      <TouchableOpacity style={styles.addBtn} onPress={openNewLoanModal}>
        <Text style={{ color: '#fff', fontSize: 18 }}>＋ Add Loan</Text>
      </TouchableOpacity>

      {/* ── Modal ── */}
      <Modal visible={modalVisible} animationType="slide">
        <SafeAreaView style={styles.modalWrap}>
          <Text style={styles.h2}>{editingId ? 'Edit Loan' : 'New Loan'}</Text>

          {['Loan Name', 'Principal ($)', 'Interest (%)', 'Term (months)'].map(
            (label, idx) => {
              const keys = ['name', 'principal', 'interest', 'term'] as const;
              const k = keys[idx];
              return (
                <TextInput
                  key={k}
                  placeholder={label}
                  keyboardType={k === 'name' ? 'default' : 'numeric'}
                  value={form[k]}
                  onChangeText={val => setForm(p => ({ ...p, [k]: val }))}
                  style={styles.input}
                />
              );
            },
          )}

          <View style={{ flexDirection: 'row', gap: 12, marginTop: 20 }}>
            <TouchableOpacity
              style={[styles.modalBtn, { backgroundColor: '#ccc' }]}
              onPress={() => { setModalVisible(false); resetForm(); }}
            >
              <Text>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalBtn} onPress={saveLoan}>
              <Text style={{ color: '#fff' }}>{editingId ? 'Save' : 'Add'}</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: '#fff', padding: 20 },
  h1:             { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  loanCard:       {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eef6ff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  loanName:       { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  loanDetail:     { color: '#555' },
  delete:         { fontSize: 20, color: '#d00', padding: 4 },
  addBtn:         {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 30,
    elevation: 2,
  },
  // modal
  modalWrap:      { flex: 1, padding: 20 },
  h2:             { fontSize: 24, fontWeight: '600', marginBottom: 20 },
  input:          {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  modalBtn:       {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#007AFF',
  },
});

export default LoanDashboard;
