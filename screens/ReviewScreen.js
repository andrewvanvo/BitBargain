import React from 'react'
import { Text, TouchableOpacity, View, TextInput, TouchableWithoutFeedback, Keyboard} from 'react-native'
import Stars from 'react-native-stars';
import styles from '../Styles'
import IconA5 from 'react-native-vector-icons/Fontisto';
import { Formik } from 'formik';
import { collection, doc, setDoc, updateDoc, increment } from "firebase/firestore";
import { db } from '../firebase';

import { Timestamp } from "firebase/firestore";
import { UserContext } from '../contexts/UserContext';

class ReviewScreen extends React.Component {
    
    constructor(props) {
        console.log(props.route.params);
        super(props);
        
        this.state = {
            showModal: false,
            rating: 4,
        }
    }
    static contextType = UserContext;
   
    setShowModal = (show) => {
        this.setState({showModal: show});
      }

    reviewText = (label) => {
        return (
            <Text
                style={styles.shadow}
            >{label}</Text>
        );
    }

    submitToDatabase = (values) => {
        const reviewRef = doc(collection(db, 'reviews'));
        setDoc(reviewRef, {
            content: values.review,
            date: new Date(),
            dislikes: 0,
            likes: 0,
            product_id: this.props.route.params.item.product_id,
            rating: this.state.rating,
            title: values.title,
            user_id: this.props.route.params.userID,
            review_id: reviewRef.id,
        });
    }
    
    postData = async (values, user) => {
        const newCommentRef = doc(collection(db, 'system_activity'))
        const previewPost = values.review
        
        const postDescription = `Product: ${this.props.route.params.item.product_name}\nTitle: ${values.title}\nStars: ${this.state.rating}\n${previewPost}`
        await setDoc(newCommentRef, {
          id: newCommentRef.id,
          imageURL: user['profileImage'],
          postDescription: postDescription,
          postCreated: Timestamp.now(),
          postType: 'review',
          username: user['fname'] + ' ' + user['lname']
        })
      }

    updateProfile = async (UID, loading, setLoading) => {
        const newUserProfileRef = doc(db, 'users', UID)
        await updateDoc(newUserProfileRef, {
            numReview: increment(1),
            progressLevel: increment(20),
        })
        setLoading(!loading)
    }

    render() {
        const {userProfile, setUserProfile, loading, setLoading, UID} = this.context
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.centerItems} >
                    <Formik
                        initialValues={{
                            title: '',
                            review: '',
                        }}
                        onSubmit={async (values, actions) => {
                            // Will create a function that submits the form values to 'reviews' in Firebase
                            this.submitToDatabase(values);
                            this.postData(values, userProfile);
                            this.updateProfile(UID, loading, setLoading);
                            actions.resetForm();
                            // this.props.navigation.goBack()
                            this.props.navigation.navigate('Home')
                        }}
                    >
                        {(formikProps) => (
                            <View style={[styles.centerItems, {flexDirection: 'column',}]}>                        
                                <View style={styles.verticalSpacer}>
                                    <Text style={[styles.shadow, styles.largeText]}>Write a Review</Text>
                                </View>
                                <View style={{alignItems: 'flex-start'}}>
                                    {this.reviewText('Rating')}
                                    <View style={styles.verticalSpacer}>
                                        <Stars
                                            default={4}
                                            count={5}
                                            half={false}
                                            update={(val) => this.setState({rating: val})}
                                            emptyStar={<IconA5 name={'star'} size={26}  style={[styles.stars, styles.emptyStar]}></IconA5>}
                                            halfStar={<IconA5 name={'star-half'} size={26}  style={[styles.stars]}></IconA5>}
                                            fullStar={<IconA5 name={'star'} size={26} style={[styles.stars,]}></IconA5>}
                                        />
                                    </View>
                                    {this.reviewText('Title')}
                                    <TextInput
                                        placeholder='Enter a title...'
                                        value={formikProps.values.title}
                                        onChangeText={formikProps.handleChange('title')}
                                        style={styles.inputField}
                                    />
                                    {this.reviewText('Your Review')}
                                    <TextInput
                                        placeholder='Tell us your thoughts...'
                                        value={formikProps.values.review}
                                        onChangeText={formikProps.handleChange('review')}
                                        style={[styles.inputField, {height: 300}]}
                                        multiline={true}                          
                                    />
                                </View >
                                <View style={styles.isRow}>
                                    <TouchableOpacity
                                        style={[styles.whiteBtn, styles.grayBtn,]}
                                        onPress={() => this.props.navigation.goBack()}
                                    >
                                        <Text>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.whiteBtn, styles.orangeBtn,]}
                                        onPress={formikProps.handleSubmit}
                                    >
                                        <Text>Submit</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </Formik>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

export default ReviewScreen