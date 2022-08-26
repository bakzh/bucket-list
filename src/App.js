import React,{useState} from 'react';
import { StatusBar} from 'react-native';
import styled, { ThemeProvider } from 'styled-components/native';
import theme from './theme';
import {Dimensions} from 'react-native';
import Input from './components/Input';
import Task from './components/Task';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';
import DeleteAll from './components/DeleteAll';

const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.background};
  align-items: center;
  justify-content: flex-start;
`;

const Title = styled.Text`
  width: 100%;
  font-size: 40px;
  font-weight: 600;
  color: ${({theme}) => theme.main};
  align-self: center;
  text-align: center;
  margin: 0px 20px;
`;

const List = styled.ScrollView`
  flex: 1;
  width: ${({width}) => width -40}px;
`;

export default function App() {

  const [isReady, setIsReady] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [tasks, setTasks] = useState({});
  
  //데이터 저장하기
  const _saveTasks = async tasks => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
      setTasks(tasks);
    } catch (e) {
      console.error(e);
    }
  };

  //데이터 불러오기
  const _loadTasks = async () => {
    const loadedTasks = await AsyncStorage.getItem('tasks');
    setTasks(JSON.parse(loadedTasks || '{}'));
  };

  //추가
  const _addTask = () => {
    const ID = Date.now().toString();
    const newTaskObject = {
      [ID]: {id: ID, text: newTask, completed: false},
    };
    setNewTask('');
    _saveTasks({...tasks,...newTaskObject});
  };

  const _handleTextChange = text => {
    setNewTask(text);
  };

  //삭제
  const _deleteTask = id => {
    const currentTasks = Object.assign({}, tasks);
    delete currentTasks[id];
    _saveTasks(currentTasks);
  };

  //완료
  const _toggleTask = id => {
    const currentTasks = Object.assign({}, tasks);
    currentTasks[id]['completed'] = !currentTasks[id]['completed'];
    _saveTasks(currentTasks);
  };

  //수정
  const _updateTask = item => {
    const currentTasks = Object.assign({}, tasks);
    currentTasks[item.id] = item;
    _saveTasks(currentTasks);
  };
  
  //입력취소
  const _onBlur = () => {
    setNewTask('');
  };


  const width = Dimensions.get('window').width;

  return isReady ? (
    <ThemeProvider theme={theme}>
      <Container>
        <StatusBar barStyle="light-content" backgroundColor={theme.background}/>
        <Title width={width}>버킷 리스트</Title>
        <Input
          placeholder='+ 항목추가'
          value={newTask}
          onChangeText={_handleTextChange}
          onSubmitEditing={_addTask}
          onBlur={_onBlur}
          />
        <List width={width}>
          {Object.values(tasks)
                 .reverse()
                 .map(item => (
                  <Task
                    key={item.id}
                    item={item}
                    deleteTask={_deleteTask}
                    toggleTask={_toggleTask}
                    updateTask={_updateTask}
                    />
                 ))}
        </List>
      </Container>
      <DeleteAll >완료항목 전체삭제</DeleteAll>
    </ThemeProvider>
  ) : (
    <AppLoading
      startAsync={_loadTasks}
      onFinish={() => setIsReady(true)}
      onError={console.error}
    />
  );
}
