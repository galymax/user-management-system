<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="users"
      :items-per-page="5"
      class="elevation-1"
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>User Management</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn color="primary" class="mb-2" @click="openDialog()">
            NEW USER
          </v-btn>
        </v-toolbar>
      </template>
      
      <template #[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon small class="mr-2" @click="openAssignRoles(item)">
          mdi-shield-account
        </v-icon>
        <v-icon small @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field v-model="editedItem.firstName" label="First name"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field v-model="editedItem.lastName" label="Last name"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field v-model="editedItem.email" label="Email"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field v-model="editedItem.phoneNumber" label="Phone"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="close">Cancel</v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancel</v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">OK</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogAssignRoles" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Assign Roles</span>
        </v-card-title>
        <v-card-text>
          <v-select
            v-model="selectedRoles"
            :items="availableRoles"
            item-title="name"
            item-value="_id"
            label="Roles"
            multiple
            chips
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="closeAssignRoles">Cancel</v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="assignRoles">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const users = ref([]);
const dialog = ref(false);
const dialogDelete = ref(false);
const dialogAssignRoles = ref(false);

const defaultItem = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  roles: [],
};

const editedIndex = ref(-1);
const editedItem = ref({ ...defaultItem });
const selectedUser = ref(null);
const selectedRoles = ref([]);
const availableRoles = ref([]);

const formTitle = computed(() => {
  return editedIndex.value === -1 ? 'New User' : 'Edit User';
});

const headers = [
  { title: 'First Name', align: 'start', key: 'firstName' },
  { title: 'Last Name', align: 'start', key: 'lastName' },
  { title: 'Email', align: 'start', key: 'email' },
  { title: 'Phone', align: 'start', key: 'phoneNumber' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'center', width: '150px' },
];

onMounted(async () => {
  await initialize();
  await fetchRoles();
});

const initialize = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/users');
    users.value = response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

const fetchRoles = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/roles');
    availableRoles.value = response.data;
  } catch (error) {
    console.error('Error fetching roles:', error);
  }
};

const editItem = (item) => {
  editedIndex.value = users.value.indexOf(item);
  editedItem.value = Object.assign({}, item, { roles: item.roles.map(role => role._id) });
  dialog.value = true;
};

const deleteItem = (item) => {
  editedIndex.value = users.value.indexOf(item);
  editedItem.value = Object.assign({}, item);
  dialogDelete.value = true;
};

const deleteItemConfirm = async () => {
  try {
    await axios.delete(`http://localhost:3000/api/users/${editedItem.value._id}`);
    users.value.splice(editedIndex.value, 1);
    closeDelete();
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};

const close = () => {
  dialog.value = false;
  editedIndex.value = -1;
  editedItem.value = Object.assign({}, defaultItem);
};

const closeDelete = () => {
  dialogDelete.value = false;
  editedIndex.value = -1;
  editedItem.value = Object.assign({}, defaultItem);
};

const save = async () => {
  try {
    const userData = {
      firstName: editedItem.value.firstName,
      lastName: editedItem.value.lastName,
      email: editedItem.value.email,
      phoneNumber: editedItem.value.phoneNumber
    };

    if (editedIndex.value > -1) {
      const response = await axios.put(`http://localhost:3000/api/users/${editedItem.value._id}`, userData);
      Object.assign(users.value[editedIndex.value], response.data);
    } else {
      const response = await axios.post('http://localhost:3000/api/users', userData);
      users.value.push(response.data);
    }
    close();
    await initialize();
  } catch (error) {
    console.error('Error saving user:', error);
    console.error('Error response:', error.response);
    alert(error.response?.data?.message || 'An error occurred while saving the user');
  }
};

const openDialog = () => {
  editedIndex.value = -1;
  editedItem.value = Object.assign({}, defaultItem);
  dialog.value = true;
};

const openAssignRoles = async (item) => {
  selectedUser.value = item;
  selectedRoles.value = item.roles.map(role => role._id);
  dialogAssignRoles.value = true;
};

const closeAssignRoles = () => {
  dialogAssignRoles.value = false;
  selectedUser.value = null;
  selectedRoles.value = [];
};

const assignRoles = async () => {
  try {
    await axios.post(`http://localhost:3000/api/users/${selectedUser.value._id}/roles`, {
      roles: selectedRoles.value,
    });
    await initialize();
    closeAssignRoles();
  } catch (error) {
    console.error('Error assigning roles:', error);
  }
};
</script>