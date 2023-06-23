import React, { useEffect, useState } from 'react';
import TollIcon from '@mui/icons-material/Toll';
import InsertCommentIcon from '@mui/icons-material/InsertComment';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import './SideBar.css';
import UserProfile from './UserProfile';
import user from './user.png';  
import db from './../firebase';


function SideBar({currentUser, signOut}) {
  const [searchInput, setSearchInput] = useState("");
  const [allUsers, setallUsers] = useState([]);
  const [friendList, setFriendList] =useState([]);


  useEffect(()=>{
    const getAllUsers = async()=>{
      const data = await db.collection('users').onSnapshot(snapShot =>{
        setallUsers(snapShot.docs.filter((doc) =>doc.data().email !== currentUser.email  ))})
    }
    const getFriends = async()=>{
      const data = await db
      .collection('FriendList')
      .doc(currentUser.email)
      .collection('list')
      .onSnapshot((snapshot)=>{
        setFriendList(snapshot.docs)
      })

    }
    
    getAllUsers()
    getFriends()
    
  },[])

  const searchedUser = allUsers.filter((user)=>{ 
    if(searchInput){ 
      if(user.data().fullname.toLowerCase().includes(searchInput.toLowerCase())){
        return user
      }
    
    }})

  const searchItem = searchedUser.map((user)=>{
    return(
      <UserProfile 
      name={user.data().fullname} 
      photoURL={user.data.photoURL}
      key = {user.id}
      email = {user.data().email}
      />
    )
  })

  return (
    <div className='sidebar'>
        <div className='sidebar-header'>
            <div className='sidebar-header-img' onClick={signOut}>
               <img src={currentUser?.photoURL} alt=''/>
            </div>
            <div className='sidebar-header-btn'>
                <TollIcon/>
                <InsertCommentIcon/>
                <MoreVertIcon/>
            </div>
        </div>
        <div className='sidebar-search'>
            <div className='sidebar-search-input'>
                <SearchIcon/>
                <input type='text'
                  value={searchInput}
                  onChange={(e) =>setSearchInput(e.target.value)}
                  name='Search'
                  placeholder='Search...'/>
            </div>
        </div>
        <div className='sidebar-chat-list'>
          { searchItem.length>0 
            ? (searchItem)
            : friendList.map((friend) => (
              <UserProfile 
               name = {friend.data().fullname}
              photoURL={friend.data().photoURL} 
              lastMessage={friend.data().lastMessage}
              email={friend.data().email}
                />
            ))}
          
        </div>
    </div>
  )
}

export default SideBar
