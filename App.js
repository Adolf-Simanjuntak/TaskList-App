import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [filter, setFilter] = useState('Semua');

  const addTask = () => {
    if (taskInput.trim() === '') {
      Alert.alert('Yah!', 'Task-nya diisi dulu ya ~');
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      title: taskInput.trim(),
      done: false,
      priority: 'Sedang',
    };

    setTasks([...tasks, newTask]);
    setTaskInput('');
  };

  const toggleDone = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, done: !task.done } : task
    ));
  };

  const deleteTask = (id) => {
    Alert.alert(
      'Hapus Task?',
      'Task yang dihapus ga bisa dikembalikan loh',
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Hapus', onPress: () => setTasks(tasks.filter(task => task.id !== id)) }
      ]
    );
  };

  const changePriority = (id, newPriority) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, priority: newPriority } : task
    ));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'Aktif') return !task.done;
    if (filter === 'Selesai') return task.done;
    return true;
  });

  const completedCount = tasks.filter(t => t.done).length;
  const totalTasks = tasks.length;

  const getPriorityEmoji = (priority) => {
    if (priority === 'Tinggi') return '🔥';
    if (priority === 'Sedang') return '🟡';
    return '✅';
  };

  const getPriorityBg = (priority) => {
    if (priority === 'Tinggi') return '#FEE2E2';
    if (priority === 'Sedang') return '#FEF3C7';
    return '#D1FAE5';
  };

  const getPriorityTextColor = (priority) => {
    if (priority === 'Tinggi') return '#DC2626';
    if (priority === 'Sedang') return '#D97706';
    return '#059669';
  };

  const renderTask = ({ item }) => (
    <View style={styles.taskCard}>
      <TouchableOpacity 
        style={styles.checkbox}
        onPress={() => toggleDone(item.id)}
      >
        <View style={[
          styles.checkBox,
          item.done && styles.checkBoxDone
        ]}>
          {item.done && <Text style={styles.checkMark}>✓</Text>}
        </View>
      </TouchableOpacity>

      <View style={styles.taskInfo}>
        <Text style={[
          styles.taskTitle,
          item.done && styles.taskTitleDone
        ]}>
          {item.title}
        </Text>
        
        <View style={styles.priorityRow}>
          <Text style={styles.priorityLabel}>Prioritas:</Text>
          <View style={styles.priorityGroup}>
            {['Tinggi', 'Sedang', 'Rendah'].map(prio => (
              <TouchableOpacity
                key={prio}
                style={[
                  styles.priorityPill,
                  { 
                    backgroundColor: item.priority === prio ? getPriorityBg(prio) : '#F3F4F6',
                    borderWidth: item.priority === prio ? 0 : 1,
                    borderColor: '#E5E7EB'
                  }
                ]}
                onPress={() => changePriority(item.id, prio)}
              >
                <Text style={[
                  styles.priorityPillText,
                  { color: getPriorityTextColor(prio) }
                ]}>
                  {getPriorityEmoji(prio)} {prio}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.deleteBtn}
        onPress={() => deleteTask(item.id)}
      >
        <Text style={styles.deleteText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient 
      colors={['#FFE4E0', '#FFF0E6', '#E8F0FE']} 
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.headerEmoji}>✨</Text>
        <Text style={styles.title}>TaskFlow</Text>
        <Text style={styles.subtitle}>Make it happen today</Text>
      </View>

      {/* Input Form */}
      <View style={styles.inputWrapper}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputIcon}>📝</Text>
          <TextInput
            style={styles.input}
            placeholder="Tulis task baru..."
            placeholderTextColor="#AAA"
            value={taskInput}
            onChangeText={setTaskInput}
            onSubmitEditing={addTask}
          />
        </View>
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addButtonText}>+ Tambah</Text>
        </TouchableOpacity>
      </View>

      {/* Counter & Filter */}
      <View style={styles.statsSection}>
        <View style={styles.counterCard}>
          <Text style={styles.counterLabel}>Progress</Text>
          <Text style={styles.counterValue}>
            {completedCount}/{totalTasks}
          </Text>
        </View>

        <View style={styles.filterGroup}>
          {['Semua', 'Aktif', 'Selesai'].map(f => (
            <TouchableOpacity
              key={f}
              style={[
                styles.filterChip,
                filter === f && styles.filterChipActive
              ]}
              onPress={() => setFilter(f)}
            >
              <Text style={[
                styles.filterChipText,
                filter === f && styles.filterChipTextActive
              ]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Task List */}
      <FlatList
        data={filteredTasks}
        renderItem={renderTask}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>Kosong nih...</Text>
            <Text style={styles.emptyMessage}>Yuk tambah task baru di atas!</Text>
          </View>
        }
        contentContainerStyle={styles.listArea}
        showsVerticalScrollIndicator={false}
      />

      {/* Footer */}
      <Text style={styles.footerNote}>TaskFlow • Stay productive ✨</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 55,
  },

  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  headerEmoji: {
    fontSize: 48,
    marginBottom: 4,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#1F2937',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: '#F97316',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },

  inputWrapper: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 15,
    color: '#1F2937',
  },
  addButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 20,
    paddingHorizontal: 20,
    justifyContent: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },

  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  counterCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  counterLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  counterValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  filterGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  filterChipActive: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  filterChipText: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },

  listArea: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },

  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  checkbox: {
    marginRight: 14,
  },
  checkBox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  checkBoxDone: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  checkMark: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 6,
  },
  taskTitleDone: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  priorityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  priorityLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  priorityGroup: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  priorityPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 30,
  },
  priorityPillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  deleteBtn: {
    padding: 8,
  },
  deleteText: {
    fontSize: 20,
  },

  emptyBox: {
    alignItems: 'center',
    marginTop: 80,
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 32,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
  },
  emptyMessage: {
    fontSize: 13,
    color: '#9CA3AF',
  },

  footerNote: {
    textAlign: 'center',
    color: '#C4B5FD',
    fontSize: 11,
    paddingVertical: 16,
    fontWeight: '500',
  },
});

export default App;