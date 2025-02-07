<template>
  <v-app>
    <v-app-bar app color="yellow darken-2">
      <v-toolbar-title>Manager</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="logoutUser" color="white" text>
        Logout
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-expansion-panels v-model="panel" :disabled="disabled" multiple>
        <v-expansion-panel :key="'form-panel'" v-model="requestsPanelOpen">
          <v-expansion-panel-header>Manager Approval Terminal</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-data-table :headers="headers" :items="managerRequests" @click:row="selectRow">
              <template v-slot:item="{ item }">
                <tr @click="selectRow(item)">
                  <td>{{ item.requestDate }}</td>
                  <td>{{ item.requesterName }}</td>
                  <td>{{ item.reasonForRequest }}</td>
                  <td>{{ item.statusText }}</td>
                  <td>
                    <v-icon size="Extra large" class="me-6" @click="openAssignDialog(item)">
                      mdi-pencil
                    </v-icon>

                  </td>
                </tr>
              </template>
            </v-data-table>

            <v-dialog v-model="showAssignDialog" transition="dialog-bottom-transition" max-width="600">
              <v-card>
                <v-card-title>Approval Options</v-card-title>
                <v-card-text>
                  You Will Be Accepting Or Declining The Request To Be Implementated
                </v-card-text>
                <v-card-actions>
                  <v-btn color="yellow darken-2" @click="approveSelectedRequest(selectedItemId)">Approve</v-btn>
                  <v-btn color="yellow darken-2" @click="rejectSelectedRequest(selectedItemId)">Reject</v-btn>

                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-expansion-panel-content>

          <v-expansion-panel-header>Approved Requests</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-data-table :headers="headers" :items="approvedRequests" @click:row="selectRow">
              <template v-slot:item="{ item }">
                <tr @click="selectRow(item)">
                  <td>{{ item.requestDate }}</td>
                  <td>{{ item.requesterName }}</td>
                  <td>{{ item.reasonForRequest }}</td>
                  <td>{{ item.statusText }}</td>
                  <td>
                    <v-icon size="Extra Large" @click="openReport(item)">mdi-information</v-icon>
                  </td>
                </tr>
              </template>
            </v-data-table>

            <v-dialog v-model="ReportDial" transition="dialog-bottom-transition" max-width="1200">
              <v-card>
                <v-card-title class="headline">Report Details</v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                  <v-container>
                    <v-row v-if="userRequests.length > 0">
                      <v-col cols="12">
                        <v-data-table :headers="reportTitles" :items="userRequestsWithStatusText"
                          item-key="requestDetailId">
                          <template v-slot:item="{ item }">
                            <tr>
                              <td>{{ item.requestDate }}</td>
                              <td>{{ item.reasonForRequest }}</td>
                              <td>{{ item.requestImplementationDate }}</td>
                              <td>{{ item.manager }}</td>
                              <td>{{ item.requestDetailsName }}</td>
                              <td>{{ item.RequestId }}</td>
                              <td>{{ item.RequestType }}</td>
                              <td>{{ item.RequesterName }}</td>
                              <td>{{ item.statusText }}</td>
                            </tr>
                          </template>
                        </v-data-table>
                      </v-col>
                    </v-row>
                    <v-row v-else>
                      <v-col cols="12">
                        <p>No data available</p>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-btn color="yellow darken-2" @click="fetchManagerRequests">Download</v-btn>
                  <v-btn color="yellow darken-2" @click="ReportDial = false">Close</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-main>
    <v-snackbar v-model="snackbar" :timeout="timeout" :color="snackbarColor">
      {{ snackbarMessage }}
      <v-btn text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
import axiosInstance from '@/Services/axios';

export default {
  data() {
    return {
      panel: [0, 1],
      disabled: false,
      readonly: false,
      showAssignDialog: false,
      selectedItem: null,
      managerRequests: [],
      approvedRequests: [],
      ReportDial: false,
      userRequests: [],
      reportTitles: ['Date', 'Reason', 'Implentation Date', 'Status'],
      Reportsheaders: [
        { text: 'Request Date', value: 'requestDate', sortable: false },
        { text: 'Reason for Request', value: 'reasonForRequest', sortable: false },
        { text: 'Implementation Date', value: 'requestImplementationDate', sortable: false },
        { text: 'Manager', value: 'manager', sortable: false },
        { text: 'Request Details Name', value: 'requestDetailsName', sortable: false },
        { text: 'Request ID', value: 'RequestId', sortable: false },
        { text: 'Request Type', value: 'RequestType', sortable: false },
        { text: 'Requester Name', value: 'RequesterName', sortable: false },
        { text: 'Status', value: 'statusText', sortable: false },
        { text: 'Actions', sortable: false }
      ],
      titles: ['Date', 'Reason', 'Implentation Date', 'Status'],
      headers: [
        { text: 'Request Date', value: 'requestDate', sortable: false },
        { text: 'Requester Name', value: 'requesterName', sortable: false },
        { text: 'Reason for Request', value: 'reasonForRequest', sortable: false },
        { text: 'Status', value: 'statusId', sortable: false },
        { text: 'Actions', sortable: false }
      ],
      snackbar: false,
      snackbarMessage: '',
      snackbarColor: 'success',
      timeout: 5000,
    };
  },

  methods: {
    async fetchManagerRequests() {
      try {
        const response = await axiosInstance.get('RequestDetails/GetMyAllChangeRequest');
        if (response.status === 200) {
          const allRequests = response.data;

          const statusMap = {
            1: 'Pending',
            2: 'Approved by Developer',
            3: 'Approved by Manager',
            4: 'Rejected by Manager'
          };

          // Filter pending requests and include status text
          this.managerRequests = allRequests.filter(request => request.statusId === 2)
            .map(request => ({
              ...request,
              statusText: statusMap[request.statusId] || 'Unknown Status'
            }));

          // Filter approved requests and include status text
          this.approvedRequests = allRequests.filter(request => request.statusId === 2 || request.statusId === 3 || request.statusId === 4)
            .map(request => ({
              ...request,
              statusText: statusMap[request.statusId] || 'Unknown Status'
            }));

          // Populate userRequests if needed
          this.userRequests = allRequests;
          // this.ReportDial = true; 
        } else {
          console.error('Failed to fetch change requests:', response.data);
        }
      } catch (error) {
        console.error('An error occurred while fetching change requests:', error);
      }
    },


    /*async fetchManagerRequests() {
      try {
        const response = await axios.get('https://localhost:7072/api/RequestDetails/GetMyAllChangeRequest');
        if (response.status === 200) {
          const allRequests = response.data;
          const statusMap = {
            1: 'Pending',
            2: 'Approved by Developer',
            3: 'Approved by Manager',
            4: 'Rejected by Manager'
          };

          // Filter pending requests and include status text
          this.managerRequests = allRequests.filter(request => request.statusId === 2)
            .map(request => ({
              ...request,
              statusText: statusMap[request.statusId] || 'Unknown Status'
            }));

          // Filter approved requests and include status text
          this.approvedRequests = allRequests.filter(request => request.statusId === 3 || request.statusId === 4)
            .map(request => ({
              ...request,
              statusText: statusMap[request.statusId] || 'Unknown Status'
            }));
        } else {
          console.error('Failed to fetch change requests:', response.data);
        }
      } catch (error) {
        console.error('An error occurred while fetching change requests:', error);
      }
    },*/

    async approveSelectedRequest() {
      try {
        if (!this.selectedItem) {
          console.error('No row selected.');
          return;
        }
        const response = await axiosInstance.post(`ManagerApproval/approve/${this.selectedItem}`, {
          approvalDecision: true
        });
        console.log(response.data);
        this.fetchManagerRequests();
        this.showAssignDialog = false;
        this.showSnackbar('Request approved successfully', 'success');
      } catch (error) {
        console.error(error);
        this.showSnackbar('Failed to approve request', 'error');
      }
    },


    async rejectSelectedRequest() {
      try {
        if (!this.selectedItem) {
          console.error('No row selected.');
          return;
        }
        const response = await axiosInstance.post(`ManagerApproval/reject/${this.selectedItem}`, {
          approvalDecision: true
        });
        console.log(response.data);
        this.fetchManagerRequests();
        this.showAssignDialog = false;
        this.showSnackbar('Request rejected successfully', 'red');
      } catch (error) {
        console.error(error);
        this.showSnackbar('Failed to reject request', 'error');
      }
    },




    // Method to show the snackbar
    showSnackbar(message, color) {
      this.snackbarMessage = message;
      this.snackbarColor = color;
      this.snackbar = true;
    },

    //this section is for selectedItem
    selectRow(item) {
      this.selectedItem = item.requestDetailId;
      console.log(this.selectedItem);
    },

    openAssignDialog(item) {
      this.selectedItem = item;
      this.showAssignDialog = true;
    },

    openReport(item) {
      this.selectedItem = item;
      this.ReportDial = true;
    },

    logoutUser() {
      this.$store.dispatch('logout')
        .then(() => {
          this.$store.commit('clearToken');
          localStorage.removeItem('token');
          this.$router.push('/');
        })
        .catch((error) => {
          console.error('Logout failed:', error);
        });
    },
  },

  mounted() {
    // Fetch manager requests
    this.fetchManagerRequests();
  },
};
</script>

<style>
.v-main {
  margin-bottom: 30px;
  margin-top: 30px;
  margin-right: 30px;
  margin-left: 30px;
}
</style>
Services/axios