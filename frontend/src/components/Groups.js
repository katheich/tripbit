import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Auth from '../lib/Auth'

import GroupCard from './GroupCard'
import GroupForm from './GroupForm'

const Groups = (props) => {

  const [groups, setGroups] = useState([])
  const [errors, setErrors] = useState('')
  const [newGroupModal, setnewGroupModal] = useState(false)


  function fetchGroupData() {
    axios.get('/api/groups', {
      headers: { Authorization: `Bearer ${Auth.getToken()}` }
    })
      .then(resp => {
        const data = resp.data.sort(function(a, b){
          if (a.id < b.id) { return -1 }
          if (a.id > b.id) { return 1 }
          return 0
        })
        setGroups(data)
      })
      .catch(err => {
        console.log(err)
        setErrors({ ...errors, ...err })
      })
  }

  useEffect(() => {
    fetchGroupData()
  }, [])

  function goToGroupProfile(e) {
    props.history.push(`/groups/${e.target.id}`)
  }

  function sendRequest(e) {
    // send request to join group to API
    // reload groups

    console.log(e.target.id)

    axios.get(`api/groups/${e.target.id}/membership/`, {
      headers: { Authorization: `Bearer ${Auth.getToken()}` }
    })
      .then(resp => {
        console.log(resp)
        fetchGroupData()
      })
      .catch(err => {
        console.log(err)
        setErrors({ ...errors, ...err })
      })
  }

  function toggleModal() {
    setnewGroupModal(!newGroupModal)
  }

  return (
    <section className="section" id="groups-page">
      {console.log(groups)}
      <div className="container">

        <div className="level is-mobile">
          <div className="level-left">
            <div className="title level-item">Groups</div>
          </div>
          <div className="level-right">
            <button className="button is-link is-medium" onClick={toggleModal}>
              <span className="icon is-small is-left">
                <i className="fas fa-plus-circle"></i>
              </span>
              <span className="text">
                Add Group
              </span>
            </button>
          </div>
        </div>
        <div className="groups-grouping">
          <div className="subtitle">
            Groups you belong to
          </div>
          

          <div className="columns is-mobile is-multiline">
            {groups
              .filter((group) => {
                return group.members
                  .reduce((list, member) => {
                    list.push(member.id)
                    return list
                  }, [])
                  .includes(Auth.getUserId())
              })
              .map((group, i) => {
                return <GroupCard 
                  key={i}
                  group={group}
                  goToGroupProfile={(e) => goToGroupProfile(e)}
                  sendRequest={(e) => sendRequest(e)}
                />
              })}
          </div>
        </div>

        <div className="groups-grouping">
          <div className="subtitle">
            All other groups
          </div>

          <div className="columns is-mobile is-multiline">
            {groups
              .filter((group) => {
                return !group.members
                  .reduce((list, member) => {
                    list.push(member.id)
                    return list
                  }, [])
                  .includes(Auth.getUserId())
              })
              .map((group, i) => {
                return <GroupCard 
                  key={i}
                  group={group}
                  goToGroupProfile={(e) => goToGroupProfile(e)}
                  sendRequest={(e) => sendRequest(e)}
                />
              })}
          </div>
          
          <div className={newGroupModal === true ? 'modal is-active' : 'modal'}>
            <div className="modal-background" onClick={toggleModal}></div>
            <div className="modal-content">
              <GroupForm
                toggleModal={toggleModal}
                props={props}
              />
            </div>
            <button className="modal-close is-large" aria-label="close" onClick={toggleModal}></button>
          </div>
        </div>

      </div>
    </section>
  )
}

export default Groups