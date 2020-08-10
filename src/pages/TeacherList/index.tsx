import React, { useState } from 'react';
import { View, ScrollView, Text, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons'
import AsyncStorage from '@react-native-community/async-storage';

import api from '../../services/api';

import styles from './styles';
import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TeacherItem';
import { BorderlessButton, RectButton } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';

function TeacherList() {
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  const [favorites, setFavorites] = useState<number[]>([]);
  const [teachers, setTeachers] = useState([]);

  const [subject, setSubject] = useState('');
  const [week_day, setWeekDay] = useState('');
  const [time, setTime] = useState('');

  function loadFavorites() {
    AsyncStorage.getItem('favorites').then(response => {
      if (response) {
        const favoritesTeachers = JSON.parse(response);
        const favoritesTeachersIds = favoritesTeachers.map((teacher: Teacher) => {
          return teacher.id;
        });

        setFavorites(favoritesTeachersIds);
      }
    });
  }

  useFocusEffect(() => {
    loadFavorites();
  })
  
  function handleToggleFitlersVisible() {
    setIsFiltersVisible(!isFiltersVisible);
  }

  async function handleButtonSubmit() {
    loadFavorites();

    const response = await api.get('classes',{
      params: {
        subject,
        week_day,
        time
      }
    })

    console.log(response.data);
    setIsFiltersVisible(false);
    setTeachers(response.data);
  }

  return(
    <View style={styles.container} >
      <PageHeader title="Proffys Disponiveis" 
      headerRight={(
        <BorderlessButton onPress={handleToggleFitlersVisible}>
          <Feather name="filter" size={20} color="#FFF" />
        </BorderlessButton>
      )}>
        { isFiltersVisible && (
          <View style={styles.searchForm}>
            <Text style={styles.label}>Matéria</Text>
            <TextInput 
            placeholderTextColor="#C1BCC" 
            style={styles.input} 
            placeholder="Qual a matéria?" 
            value={subject}
            onChangeText={text => setSubject(text)}/>

            <View style={styles.inputGroup}>
              <View style={styles.inputBlock}>
                <Text style={styles.label}>Dia da Semana</Text>
                <TextInput 
                placeholderTextColor="#C1BCC" 
                style={styles.input} 
                placeholder="Qual a dia?" 
                value={week_day}
                onChangeText={text => setWeekDay(text)}/>
              </View>

              <View style={styles.inputBlock}>
                <Text style={styles.label}>Horario</Text>
                <TextInput 
                placeholderTextColor="#C1BCC" 
                style={styles.input} 
                placeholder="Qual a horario?" 
                value={time}
                onChangeText={text => setTime(text)}/>
              </View>
            </View>

            <RectButton onPress={handleButtonSubmit} style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Filtrar</Text>
            </RectButton>
          </View>
        )}
      </PageHeader>

      <ScrollView 
      style={styles.teacherList}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingBottom: 16
      }}>

        {teachers.map((teacher: Teacher) => {
          return <TeacherItem key={teacher.id} teacher={teacher} favorited={favorites.includes(teacher.id)}/>
        })}        

      </ScrollView>
    </View>
  );
}

export default TeacherList;