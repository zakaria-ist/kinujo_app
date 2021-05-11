import firestore from '@react-native-firebase/firestore'
import functions from '@react-native-firebase/functions'
const db = firestore();

const getFriendPromise = (userId, msgId) => {
    return db.collection("users")
        .doc(String(userId))
        .collection("friends")
        .where("id", "==", msgId)
        .get();
}

const getCustomerPromise = (userId) => {
    return db.collection("users")
        .doc(String(userId))
        .collection("customers")
        .get();
}

const getUserTokenPromise = (userId) => {
    return db.collection("users")
        .doc(String(userId))
        .collection("token")
        .get()
}

const logTime = ({ time, label }) => {
    console.log('====================================');
    console.log(label, (new Date().getTime() - time) / 1000, 's');
    console.log('====================================');
}

export default async function messageNotify({ messageSenderID, groupID, msg }) {
    let time = new Date().getTime()

    let groupData = await db.collection("chat")
        .doc(groupID)
        .get();

    groupData = groupData.data();
    logTime({
        time,
        label: "==getGroupData"
    })
    var payload = {
        //creating message for notification to be sent
        data: {
            groupID,
            groupName: groupData.groupName,
            groupType: groupData.type || '',
        },
        notification: {
            priority: "high",
            title: "Kinujo",
            body: String(msg),
            sound: 'default',
            badge: '1'
        },
    };
    let tokens = []

    // loop all user in group chat
    const userPromise = groupData.users.map(async user => {
        let notificationStatus = "notify_" + user;

        if (user != messageSenderID && !groupData[notificationStatus]) {

            let [friends, customers, userToken] = await Promise.all([
                getFriendPromise(user, messageSenderID),
                getCustomerPromise(user),
                getUserTokenPromise(user)
            ])
            logTime({
                time,
                label: "==get promise"
            })
            // getting block mode
            let blocked = false;
            friends.docs.map((docRef) => {
                if (docRef.data().notify == false) {
                    blocked = true;
                }
            });
            customers.docs.map((docRef) => {
                if (docRef.id == String(messageSenderID)) {
                    blocked = docRef.data().blockMode ? true : false;
                }
            });

            // send noti 

            if (friends.size == 0 || !blocked) {
                userToken.docs.map((docRef) => {
                    let token = docRef.data().tokenID
                    token && tokens.push(token)
                })
            }
        }
        return 0
    })

    await Promise.all(userPromise)

    console.log('====================================');
    console.log('==list token', tokens, msg, ' duration ', logTime({
        time, label: 'end of function'
    }));
    console.log('====================================');


    tokens.length && functions().httpsCallable('messageNotification')({
        tokens,
        notiData: payload
    }).then(rs => {
        console.log('====================================');
        console.log('==sent');
        console.log('====================================');
    }).catch(err => {
        console.log('====================================');
        console.log('==error', err);
        console.log('====================================');
    })
}

