<script setup>
import { onMounted, reactive } from "vue";

import '../styles/style.css';
import '../style.css';
import Groups from '../scripts/groups.js';
import edit from "../scripts/comment.js";
import Modal from "./Modal.vue";
import Navbar from "./Navbar.vue";

const getGroups = async (groups = null) => {
  if (groups === null) {
    groups = await Groups.getGroups();
  }

  let activeGroups = [];
  console.log(groups)

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
      selectedProduct: group.Product,
      selectedTag: group.Tag
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
      selectedProduct: group.Product,
      selectedTag: group.Tag,
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
    selectedProduct: '',
    selectedTag: '',
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

const updateSecondTagOptions = (Product) => {
  switch (Product) {
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

const handleProductChange = (group) => {
  group.Tag = '';
};

setInterval(async () => {
  await getGroups();
}, 5000);
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
      <Navbar />
    </div>

    <table class="table table-zebra transition-shadow" style="text-align: center!important;">
      <thead class="bg-primary text-black">
        <tr>
          <th>Name</th>
          <th>Acknowledged by</th>
          <th>Start date</th>
          <th>Comment</th>
          <th>Product</th>
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
            {{ group.selectedProduct }}
          </td>
          <td>
            {{ group.selectedTag }}
          </td>
          <td>
            <button v-if="states.groupStatus === 'active'"
              @click="states.editCommentModal = { topicID: group.id, show: true, name: group.name, comment: group.comment, selectedProduct: group.selectedProduct, selectedTag: group.selectedTag }"
              class="btn btn-outline btn-primary btn-sm">Edit</button>
            <span v-else>-</span>
          </td>
          <td>
            <button v-if="states.groupStatus === 'active'" class="btn btn-outline btn-error btn-sm"
              @click="states.deleteGroupModal = { topicID: group.id, name: group.name, show: true }">Delete</button>
            <span v-else>-</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <Modal name="edit-comment" title="Edit comment" :show="states.editCommentModal.show" type="confirm" :on-success="edit"
    :on-success-args="[states.editCommentModal.topicID, states.editCommentModal.comment, states.editCommentModal.selectedProduct, states.editCommentModal.selectedTag]"
    @update="editCommentShowUpdateHandler">
    <div style="text-align: center">
      <span style="direction: rtl; font-weight: bold">{{ states.editCommentModal.name }}</span>
      <div class="title-span" style="margin-top: 20px">
        <span style="margin-right: 5px;">Select Product</span>
        <select style="display: inline; margin-right: 20px" v-model="states.editCommentModal.selectedProduct" class="select select-bordered"
        @change="handleproductChange(group)">
        <option disabled value="Select a tag">Select Product tag</option>
        <option :selected="states.editCommentModal.selectedProduct == 'IaaS'" value="IaaS">IaaS</option>
        <option :selected="states.editCommentModal.selectedProduct == 'CDN'" value="CDN">CDN</option>
        <option :selected="states.editCommentModal.selectedProduct == 'VOD'" value="VOD">VOD</option>
        <option :selected="states.editCommentModal.selectedProduct == 'Object'" value="Object">Object</option>
        <option :selected="states.editCommentModal.selectedProduct == 'CaaS'" value="CaaS">CaaS</option>
        <option :selected="states.editCommentModal.selectedProduct == 'DBaaS'" value="DBaaS">DBaaS</option>
        <option :selected="states.editCommentModal.selectedProduct == 'Panel'" value="Panel">Panel</option>
        <option :selected="states.editCommentModal.selectedProduct == 'Abuse'" value="Abuse">Abuse</option>
      </select>
      <span style="margin-right: 5px;"> Select Tag </span>
      <select style="display: block;" v-model="states.editCommentModal.selectedTag" class="select select-bordered">
        <option disabled value="Select a tag">Select a tag</option>
        <option v-for="tag in updateSecondTagOptions(states.editCommentModal.selectedProduct)" :selected="states.editCommentModal.selectedTag == tag" :key="tag">{{ tag }}
        </option>
      </select>
      </div>

      <textarea v-model="states.editCommentModal.comment" class="textarea textarea-bordered"
        style="width: 100%; margin-top: 20px; direction: rtl" placeholder="Comment message"></textarea>
    </div>
  </Modal>

  <Modal name="delete-group" title="Delete group" :show="states.deleteGroupModal.show" type="confirm"
    :on-success="Groups.deleteGroup" :on-success-args="[states.deleteGroupModal.topicID, states.deleteGroupModal.name]"
    @update="deleteGroupShowUpdateHandler">
    Are you sure you want to delete the thread for {{ states.deleteGroupModal.name }} group?
  </Modal>
</template>
