import React, {useCallback, useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import ActionSheet, {
  registerSheet,
  SheetManager,
} from 'react-native-actions-sheet';
import Textinput from '../StyledComponents/TextInput';
import CrossSvg from '../components/svg/CrossSvg';
import SendCommentSvg from '../components/svg/AddCommentSvg';
import {theme} from '../theme';
import SheetHeader from './SheetHeader';
import {HttpClient} from '../Api/config';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import moment from 'moment';
import 'moment-precise-range-plugin';
import {More, Trash} from 'iconsax-react-native';
import {Menu, Provider} from 'react-native-paper';
import ConfirmationModal from '../components/ConfirmationModal';
import {useSelector} from 'react-redux';
const CommentSheet = props => {
  const {userData: myData} = useSelector(state => state.auth);
  const [userData, setUserData] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [newCommentLoading, setNewCommentLoading] = useState(false);
  const commentsSheet = useRef(null);
  const [modelShow, setModelShow] = useState(false);
  const handledCreateComment = useCallback(async () => {
    if (newComment) {
      comments.length && commentsSheet.current.scrollToEnd();
      setNewCommentLoading(true);
      setNewComment('');
      try {
        const response = await HttpClient.post('comment', {
          text: newComment,
          fileId: userData._id,
        });
        if (response) {
          // handleAllComment()
          setComments([
            ...comments,
            {
              ...response.data.data,
              createdAt: dateFormate(response.data.data.createdAt),
            },
          ]);
          setNewCommentLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  });

  const MoreOptions = () => {
    const [visible, setVisible] = useState(false);
    return (
      <Provider>
        <View
          style={{
            position: 'absolute',
            right: -12,
            top: 10,
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <Menu
            visible={visible}
            contentStyle={{
              paddingVertical: 0,
              paddingHorizontal: 0,
              margin: 0,
              minHeight: 0,
              minWidth: 0,
              // maxWidth: 90,
            }}
            anchor={
              <TouchableOpacity onPress={() => setVisible(true)}>
                <More
                  size="25"
                  color="#ffffff"
                  style={{transform: [{rotate: '90deg'}]}}
                />
              </TouchableOpacity>
            }
            onDismiss={() => setVisible(false)}>
            <Menu.Item
              onPress={() => {}}
              title={
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Trash size="20" color="#000000" variant="Outline" />
                  <Text
                    style={{
                      height: 35,
                      marginLeft: 10,
                      marginTop: 14,
                      fontSize: 14,
                      color: '#000',
                      fontFamily: theme.fonts.regular.fontFamily,
                    }}>
                    Delete
                  </Text>
                </View>
              }
            />
          </Menu>
        </View>
      </Provider>
    );
  };

  const dateFormate = date => {
    let videoTime = moment(date);
    let currentTime = moment();
    var dtDiff = moment.preciseDiff(videoTime, currentTime, true);
    let showDate = '';
    if (dtDiff['years']) {
      showDate = dtDiff['years'] + 'yr';
    } else if (dtDiff['months']) {
      showDate = dtDiff['months'] + 'mon';
    } else if (dtDiff['days']) {
      showDate = dtDiff['days'] + 'd';
    } else if (dtDiff['hours']) {
      showDate = dtDiff['hours'] + 'h';
    } else if (dtDiff['minutes']) {
      showDate = dtDiff['minutes'] + 'min';
    } else {
      showDate = 'Just Now';
    }

    // console.log(dtDiff, 'booth time');

    return showDate;
  };
  const handleAllComment = useCallback(async () => {
    try {
      const response = await HttpClient.post('getCommentsForVideo', {
        fileId: userData._id,
      });
      let commentData = response.data.data.map(item => {
        return {...item, createdAt: dateFormate(item.createdAt)};
      });
      setComments(commentData);

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  });
  const handleDeleteComments = async id => {
    try {
      const response = await HttpClient.delete(`comment/${id}`);
      setComments(comments.filter(item => item._id !== id));
    } catch (error) {
      console.log(error);
    }
  };
  const showDelete = id => {
    let show = false;
    if (id == myData._id) {
      show = true;
    }
    return show;
  };

  useEffect(() => {
    if (userData) {
      setLoading(true);
      handleAllComment();
    }
  }, [userData]);

  return (
    <ActionSheet
      id={props.sheetId}
      gestureEnabled={true}
      containerStyle={{backgroundColor: '#1A222F'}}
      keyboardShouldPersistTaps="handled"
      CustomHeaderComponent={<SheetHeader />}
      onBeforeShow={({data}) => setUserData(data)}>
      <View style={styles.container}>
        <View
          style={[
            styles.row,
            {
              justifyContent: 'space-between',
              paddingBottom: 10,
              marginBottom: 20,
              borderBottomColor: '#ffffff22',
              borderBottomWidth: 1,
            },
          ]}>
          <Text style={styles.title}>Comments</Text>
          <TouchableOpacity
            activeOpacity={0.6}
            style={{padding: 10}}
            onPress={() => SheetManager.hide('commentSheet')}>
            <View style={{height: 14, width: 14}}>
              <CrossSvg viewBox="0 0 10 10" />
            </View>
          </TouchableOpacity>
        </View>
        <View style={{marginBottom: 90, maxHeight: 250}}>
          {loading ? (
            <>
              {[...Array(5)].map((e, i) => (
                <View style={{marginBottom: 10}} key={i}>
                  <SkeletonPlaceholder
                    backgroundColor="#ffffff55"
                    highlightColor="#ffffff">
                    <SkeletonPlaceholder.Item
                      flexDirection="row"
                      alignItems="center">
                      <SkeletonPlaceholder.Item
                        width={40}
                        height={40}
                        borderRadius={40}
                      />
                      <SkeletonPlaceholder.Item marginLeft={10}>
                        <SkeletonPlaceholder.Item
                          width={50}
                          height={10}
                          borderRadius={4}
                        />
                        <SkeletonPlaceholder.Item
                          marginTop={6}
                          width={250}
                          height={10}
                          borderRadius={4}
                        />
                      </SkeletonPlaceholder.Item>
                    </SkeletonPlaceholder.Item>
                  </SkeletonPlaceholder>
                </View>
              ))}
            </>
          ) : (
            <>
              {comments.length ? (
                <ScrollView
                  keyboardShouldPersistTaps="handled"
                  nestedScrollEnabled
                  showsVerticalScrollIndicator={false}
                  ref={commentsSheet}
                  automaticallyAdjustKeyboardInsets>
                  {comments?.map((comment, index) => (
                    <View
                      style={[
                        styles.row,
                        {
                          marginBottom: 10,
                          alignItems: 'flex-start',
                          paddingRight: 16,
                        },
                      ]}
                      key={index}>
                      <Image
                        source={{uri: comment.userId.profileImage}}
                        style={{width: 32, height: 32, borderRadius: 32}}
                      />
                      <View style={{paddingLeft: 8, marginTop: 8}}>
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <Text style={styles.name}>
                            {comment.userId.firstName} {comment.userId.lastName}
                          </Text>
                          <Text
                            style={[
                              styles.name,
                              {color: '#ffffff77', marginLeft: 5, fontSize: 10},
                            ]}>
                            {comment.createdAt}
                          </Text>
                        </View>
                        <Text style={[styles.name, {fontSize: 13}]}>
                          {comment.text}
                        </Text>
                      </View>
                      {/* <MoreOptions /> */}
                      {showDelete(comment.userId._id) && (
                        <TouchableOpacity
                          onPress={() => handleDeleteComments(comment._id)}
                          style={{marginLeft: 'auto', marginTop: 15}}>
                          <Trash size="20" color="#ffffff" variant="Outline" />
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
                </ScrollView>
              ) : (
                <>
                  {newCommentLoading ||
                    (!comments.length && (
                      <View style={{alignItems: 'center', paddingVertical: 10}}>
                        <Text style={styles.noComment}>No comments</Text>
                      </View>
                    ))}
                </>
              )}
              {newCommentLoading && (
                <View style={{marginBottom: 10}}>
                  <SkeletonPlaceholder
                    backgroundColor="#ffffff55"
                    highlightColor="#ffffff">
                    <SkeletonPlaceholder.Item
                      flexDirection="row"
                      alignItems="center">
                      <SkeletonPlaceholder.Item
                        width={40}
                        height={40}
                        borderRadius={40}
                      />
                      <SkeletonPlaceholder.Item marginLeft={10}>
                        <SkeletonPlaceholder.Item
                          width={50}
                          height={10}
                          borderRadius={4}
                        />
                        <SkeletonPlaceholder.Item
                          marginTop={6}
                          width={250}
                          height={10}
                          borderRadius={4}
                        />
                      </SkeletonPlaceholder.Item>
                    </SkeletonPlaceholder.Item>
                  </SkeletonPlaceholder>
                </View>
              )}
            </>
          )}
        </View>
        <View
          style={[styles.inputParent, !comments.length && {borderTopWidth: 0}]}>
          <Textinput
            placeholder="Add your comment"
            outlineColor="transparent"
            value={newComment}
            style={styles.input}
            multiline
            dense
            onChangeText={value => setNewComment(value)}
          />
          <View style={styles.commentBtn}>
            <TouchableOpacity
              style={{
                backgroundColor: theme.colors.primary,
                padding: 10,
                borderRadius: 50,
                opacity: !newComment && 0.5,
              }}
              onPress={() => handledCreateComment()}
              activeOpacity={0.7}
              disabled={!newComment ? true : false}>
              <View style={{height: 17, width: 17}}>
                <SendCommentSvg viewBox="0 0 13 13" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        {/* <ConfirmationModal
          title="Delete Comment"
          subtitle="Are you sure you want to delete this comment?"
          modelShow={modelShow}
        /> */}
      </View>
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontFamily: theme.fonts.medium.fontFamily,
    color: '#fff',
  },
  name: {
    color: '#fff',
    fontFamily: theme.fonts.regular.fontFamily,
    fontSize: 12,
  },
  input: {
    backgroundColor: '#6A6A6A22',
    borderWidth: 0,
    borderColor: '#6A6A6A22',
    justifyContent: 'center',
    paddingRight: 50,
    paddingTop: 10,
    paddingBottom: 3,
    textAlignVertical: 'top',
  },
  inputParent: {
    position: 'absolute',
    paddingHorizontal: 16,
    left: 0,
    right: 0,
    bottom: 0,
    paddingVertical: 12,
    borderTopColor: '#ffffff22',
    borderTopWidth: 1,
    backgroundColor: '#1A222F',
  },
  commentBtn: {
    position: 'absolute',
    right: 26,
    zIndex: 1,
    bottom: 21,
  },
  noComment: {
    color: '#fff',
    fontSize: 16,
    fontFamily: theme.fonts.medium.fontFamily,
  },
});

registerSheet('commentSheet', CommentSheet);

export default CommentSheet;
