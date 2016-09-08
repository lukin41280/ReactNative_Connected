'use strict';

import React, { Component } from 'react';
import { Image, StyleSheet, View, Text, Navigator, ListView, TouchableHighlight, ActivityIndicator } from 'react-native';

var Chat = require('./Chat');


var REQUEST_URL = 'http://localhost:3000/conversations';

var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        padding: 10
    },
    thumbnail: {
        width: 53,
        height: 81,
        marginRight: 10
    },
    rightContainer: {
        flex: 1
    },
    title: {
        fontSize: 20,
        marginBottom: 8
    },
    author: {
        color: '#656565'
    },
    separator: {
       height: 1,
       backgroundColor: '#dddddd'
   }, listView: {
       backgroundColor: '#F5FCFF',
       marginTop: 65,
   },
   loading: {
       flex: 1,
       alignItems: 'center',
       justifyContent: 'center'
   }
});

class Conversations extends Component {
    constructor(props) {
           super(props);
           this.state = {
            isLoading: true,
            dataSource: new ListView.DataSource({
                   rowHasChanged: (row1, row2) => row1 !== row2
               })
           };
    }

    componentDidMount() {
       this.fetchData();
    }

    fetchData() {
      fetch(REQUEST_URL)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(responseData.conversations),
            isLoading: false
        });
      })
      .done();
   }



  render() {
         if (this.state.isLoading) {
             return this.renderLoadingView();
         }

         return (
              <ListView
                  dataSource={this.state.dataSource}
                  renderRow={this.renderConversation.bind(this)}
                  style={styles.listView}
                  />
          );
  }

  renderLoadingView() {
      return (
          <View style={styles.loading}>
              <ActivityIndicator
                  size='large'/>
              <Text>
                  Loading Conversations...
              </Text>
          </View>
      );
  }

  showConversationDetail(receiving_user) {
       this.props.navigator.push({
           title: "Your Conversations",
           component: Chat,
           passProps: {receiving_user}
       });
  }



  renderConversation(user) {
     return (
          <TouchableHighlight onPress={() => this.showConversationDetail(user)}  underlayColor='#dddddd'>
              <View>
                  <View style={styles.container}>
                      <View style={styles.rightContainer}>
                          <Text style={styles.title}>{user.username}</Text>
                      </View>
                  </View>
                  <View style={styles.separator} />
              </View>
          </TouchableHighlight>
     );
   }
}

module.exports = Conversations;
