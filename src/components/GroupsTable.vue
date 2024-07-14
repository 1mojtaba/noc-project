<script setup>
import { onMounted, reactive } from "vue";

import '../styles/style.css';
import '../style.css';
import Groups from '../scripts/groups.js';
import edit from "../scripts/comment.js";
import Modal from "./Modal.vue";
import Navbar from "./Navbar.vue";

const getGroups = async (groups = demoGroups) => {
  if (groups === null) {
    groups = await Groups.getGroups();
  }

  let activeGroups = [];

  groups.map(group => {
    if (!group.hasOwnProperty('Is_new')) {
      return;
    }

    if (group['Is_new'] != 1) {
      return;
    }

    activeGroups.push({
      id: group.topicID,
      name: group.GroupName,
      ack: group.AcknowledgeBy,
      date: group.Time,
      comment: group.Comment,
      selectedProduct: group.Proudoct,
      selectedTag: group.tag
    });
  });

  try {
    await Groups.notify(states.activeGroups, activeGroups);
  } catch (e) {
    console.log('audio error', e);
  }
  states.activeGroups = activeGroups;
  if (states.groupStatus === 'active') {
    states.groups = states.activeGroups;
  }
};

const getArchivedGroups = groups => {
  let archivedGroups = [];

  groups.map(group => {
    if (group['Is_new'] != 0) {
      return;
    }

    archivedGroups.push({
      id: group.topicID,
      name: group.GroupName,
      ack: group.AcknowledgeBy,
      date: group.Time,
      comment: group.Comment,
      selectedProduct: group.Proudoct,
      selectedTag: group.tag,
    });
  });

  states.archivedGroups = archivedGroups;
};

const changeGroupStatus = async (status = null) => {
  if (status !== null) {
    states.groupStatus = status;
    return;
  }
  if (states.groupStatus === 'active') {
    states.groupStatus = 'archived';
    states.groups = [];
    const groups = await Groups.getArchivedGroups();
    getArchivedGroups(groups);
    states.groups = states.archivedGroups;
  } else {
    states.groupStatus = 'active';
    states.groups = states.activeGroups;
  }
};

const states = reactive({
  groups: [],
  archivedGroups: [],
  activeGroups: [],
  groupLen: 0,
  groupStatus: 'active',
  editCommentModal: {
    topicID: '',
    show: false,
    comment: '',
    name: '',
  },
  deleteGroupModal: {
    show: false,
    topicID: '',
    name: '',
  }
});

onMounted(async () => {
  await getGroups();
  states.groups = states.activeGroups;
});

const editCommentShowUpdateHandler = () => {
  states.editCommentModal.show = false;
  states.editCommentModal.comment = '';
};
const deleteGroupShowUpdateHandler = () => {
  states.deleteGroupModal.show = false;
};

const updateSecondTagOptions = (Proudoct) => {
  switch (Proudoct) {
    case 'IaaS':
      return [
        "IaaS-Accounting",
        "IaaS-API",
        "IaaS-Apps",
        "IaaS-Backup",
        "IaaS-Bug-Report",
        "IaaS-Change-IP",
        "IaaS-Connect-to-VM",
        "IaaS-Console-Error-1006",
        "IaaS-Custom-Image",
        "IaaS-Disk-Latency",
        "IaaS-Feature-Request",
        "IaaS-Filtering",
        "IaaS-Firewall",
        "IaaS-General-Question",
        "IaaS-Incident",
        "IaaS-Infrastructure-Question",
        "IaaS-Instance-action",
        "IaaS-Instance-Password",
        "IaaS-instance-Internet",
        "IaaS-Invoice-issue",
        "IaaS-IPV6",
        "IaaS-Local-Storage",
        "IaaS-Maintenance",
        "IaaS-OS-Question",
        "IaaS-Private-Network",
        "IaaS-PTR",
        "IaaS-Quota-Limit",
        "IaaS-Rebuild",
        "IaaS-Resize",
        "IaaS-Report",
        "IaaS-Instance-Restore",
        "IaaS-Sandbox",
        "IaaS-Shelve",
        "IaaS-SMTP-Port",
        "IaaS-Snapshot",
        "IaaS-State-Error",
        "IaaS-Traffic-Value",
        "IaaS-Volume-Root",
        "IaaS-Windows-License"
      ];
    case 'CDN':
      return [
        "CDN-Acceleration",
        "CDN-Accounting",
        "CDN-Add-Domain",
        "CDN-API",
        "CDN-Apps",
        "CDN-Bug-Report",
        "CDN-Caching",
        "CDN-CustomPages",
        "CDN-DNS",
        "CDN-Domain-Transfer",
        "CDN-Error (4XX,5XX)",
        "CDN-Feature-Request",
        "CDN-Filtering",
        "CDN-General-Question",
        "CDN-Headers",
        "CDN-Incident",
        "CDN-Invoice-Issue",
        "CDN-Loadbalancing",
        "CDN-Maintenance",
        "CDN-Network-Speed",
        "CDN-Pagerule",
        "CDN-Plan",
        "CDN-Proxy-Layer 4",
        "CDN-Report",
        "CDN-Security",
        "CDN-Send-Log",
        "CDN-SSL",
        "CDN-Traffic-Value"
      ];
    case 'VOD':
      return [
        "VOD-Audio",
        "VOD-API",
        "VOD-ADS",
        "VOD-Accounting",
        "VOD-Bug-Report",
        "VOD-Convert-Process",
        "VOD-Feature-Request",
        "VOD-General-Question",
        "VOD-Incident",
        "VOD-Invoice-Issue",
        "VOD-Live-Play-Archive",
        "VOD-Live-Playback",
        "VOD-Maintenance",
        "VOD-Playback",
        "VOD-Player",
        "VOD-Plan",
        "VOD-Report",
        "VOD-Subtitle",
        "VOD-Upload",
        "VOD-WaterMark"
      ];
    case 'Object':
      return [
        "Object-Accounting",
        "Object-Bug-Report",
        "Object-Caching",
        "Object-CORS",
        "Object-Create-Bucket",
        "Object-Delete-Bucket",
        "Object-Error (4XX,5XX)",
        "Object-Feature-Request",
        "Object-General-Question",
        "Object-Incident",
        "Object-Invoice-Issue",
        "Object-Maintenance",
        "Object-Personal-Domain",
        "Object-Plan",
        "Object-Quota-Limit",
        "Object-Report",
        "Object-Static-Website",
        "Object-SDK",
        "Object-Upload"
      ];
    case 'CaaS':
      return [
        "CaaS-Accounting",
        "CaaS-Attach-Volume",
        "CaaS-Bug-Report",
        "CaaS-CloudShell",
        "CaaS-Container-Create",
        "CaaS-Connect-to-Container",
        "CaaS-Feature-Request",
        "CaaS-General-Question",
        "CaaS-Incident",
        "CaaS-Invoice-Issue",
        "CaaS-Kubectl",
        "CaaS-Maintenance",
        "CaaS-Public-Network",
        "CaaS-Private-Network",
        "CaaS-Performance-Issue",
        "CaaS-Personal-Domain",
        "CaaS-Quota-limit",
        "CaaS-Resize",
        "CaaS-Report"
      ];
    case 'DBaaS':
      return [
        "DBaaS-API",
        "DBaaS-Accounting",
        "DBaaS-Backup",
        "DBaaS-Bug-Report",
        "DBaaS-Connect-to-Database",
        "DBaaS-Create",
        "DBaaS-Delete",
        "DBaaS-Feature-Request",
        "DBaaS-General-Question",
        "DBaaS-Incident",
        "DBaaS-Invoice-Issue",
        "DBaaS-Maintenance",
        "DBaaS-Read-Only-Node",
        "DBaaS-Restore",
        "DBaaS-Resize",
        "DBaaS-Resource",
        "DBaaS-Root-Login",
        "DBaaS-Standby-Node"
      ];
    case 'Panel':
      return [
        "Panel-Bug-Report",
        "Panel-Change-Data",
        "Panel-Delete-Account",
        "Panel-Feature-Request",
        "Panel-General-Question",
        "Panel-Giftcard",
        "Panel-IAM",
        "Panel-Incident",
        "Panel-Login",
        "Panel-Login-2FA",
        "Panel-Maintenance",
        "Panel-Money-Transfer",
        "Panel-Offline-Payment",
        "Panel-Payment",
        "Panel-Re-Found",
        "Panel-Support-Plan",
        "Panel-Ticketing-Problem",
        "Panel-White-List"
      ];
    case 'Abuse':
      return [
        "Abuse-Attack",
        "Abuse-Blacklist",
        "Abuse-Copyright",
        "Abuse-Fata",
        "Abuse-Filtering",
        "Abuse-International",
        "Abuse-Maher",
        "Abuse-Malware",
        "Abuse-Other",
        "Abuse-Passport",
        "Abuse-Phishing",
        "Abuse-Spam",
        "Abuse-Violent-threats-and-Harassment",
        "Abuse-Vulnerability"
      ];
    default:
      return [];
  }
};
 
const handleProudoctChange = (group) => {
  group.tag = ''; 
};

setInterval(async () => {
  await getGroups();
}, 3000);
setInterval(() => {
  Groups.archive();
}, 8000);
</script>

<template>
  <div class="overflow-x-auto rounded-box">
    <div class="form-control w-auto">
      <label class="cursor-pointer label">
        <span class="label-text">Show Archived</span>
        <input type="checkbox" class="toggle toggle-primary" @change="changeGroupStatus()" />
      </label>
      <a class="btn btn-ghost text-xl">NOC Notifier</a>
      <Navbar/>
    </div>
    
    <table class="table table-zebra transition-shadow" style="text-align: center!important;">
      <thead class="bg-primary text-black">
        <tr>
          <th>Name</th>
          <th>Acknowledged by</th>
          <th>Start date</th>
          <th>Comment</th>
          <th>Proudoct</th>
          <th>Tag</th>
          <th>Edit comment</th>
          <th>Delete group</th>
        </tr>
      </thead>
      <tbody>
        <tr class="hover bg-base-100" v-for="group in states.groups" :key="group.id">
          <td style="direction: rtl">{{ group.name }}</td>
          <td>{{ group.ack === null ? '-' : group.ack }}</td>
          <td>{{ group.date }}</td>
          <td style="direction: rtl">{{ group.comment === null ? '-' : group.comment }}</td>
          <td>
            <select v-model="group.Proudoct" class="select select-bordered" @change="handleProudoctChange(group)">
              <option disabled value="">Select a tag</option>
              <option>IaaS</option>
              <option>CDN</option>
              <option>VOD</option>
              <option>Object</option>
              <option>CaaS</option>
              <option>DBaaS</option>
              <option>Panel</option>
              <option>Abuse</option>
            </select>
          </td>
          <td>
            <select v-model="group.tag" class="select select-bordered">
              <option disabled value="">Select a tag</option>
              <option v-for="tag in updateSecondTagOptions(group.Proudoct)" :key="tag">{{ tag }}</option>
            </select>
          </td>
          <td>
            <button v-if="states.groupStatus === 'active'" @click="states.editCommentModal = {topicID: group.id, show: true, name: group.name, comment: group.comment}" class="btn btn-outline btn-primary btn-sm">Edit</button>
            <span v-else>-</span>
          </td>
          <td>
            <button v-if="states.groupStatus === 'active'" class="btn btn-outline btn-error btn-sm" @click="states.deleteGroupModal = { topicID: group.id, name: group.name, show: true }">Delete</button>
            <span v-else>-</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <Modal name="edit-comment"
         title="Edit comment"
         :show="states.editCommentModal.show"
         type="confirm"
         :on-success="edit"
         :on-success-args="[states.editCommentModal.topicID, states.editCommentModal.comment]"
         @update="editCommentShowUpdateHandler">
    <div style="text-align: center">
      <span style="direction: rtl; font-weight: bold">{{ states.editCommentModal.name }}</span>
      <textarea v-model="states.editCommentModal.comment"
                class="textarea textarea-bordered"
                style="width: 100%; margin-top: 20px; direction: rtl"
                placeholder="Comment message"></textarea>
    </div>
  </Modal>

  <Modal name="delete-group"
         title="Delete group"
         :show="states.deleteGroupModal.show"
         type="confirm"
         :on-success="Groups.deleteGroup"
         :on-success-args="[states.deleteGroupModal.topicID, states.deleteGroupModal.name]"
         @update="deleteGroupShowUpdateHandler">
    Are you sure you want to delete the thread for {{ states.deleteGroupModal.name }} group?
  </Modal>
</template>
