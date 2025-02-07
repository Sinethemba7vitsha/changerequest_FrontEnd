<template>
    <v-app>
        <v-app-bar app color="yellow darken-2">
            <v-toolbar-title class="white--text">User</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn @click="logoutUser" color="white" text>
                Logout
            </v-btn>
        </v-app-bar>
        <v-main>
            <v-expansion-panels v-model="panel" :disabled="disabled" multiple>

                <v-expansion-panel :key="'form-panel'" v-model="requestsPanelOpen">
                    <v-expansion-panel-header>Change Request Form</v-expansion-panel-header>

                    <v-expansion-panel-content>
                        <v-form @submit.prevent="submitForm" ref="RequestForm">
                            <v-row>
                                <v-col cols="6">
                                    <v-text-field v-model="requestDetail.RequestDetailsName" label="Request Name" outlined
                                        color="yellow darken-2" required></v-text-field>
                                    <span v-if="formSubmitted && !requestDetail.RequestDetailsName"
                                        class="red--text">Request Details Must Not Be Empty </span>
                                </v-col>
                                <v-col cols="6">
                                    <v-text-field v-model="requestDetail.ReasonForRequest" label="Reason For Request"
                                        outlined color="yellow darken-2" required></v-text-field>
                                    <span v-if="formSubmitted && !requestDetail.ReasonForRequest" class="red--text">Reason
                                        For Request Must Not Be Empty</span>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="6">
                                    <v-select v-model="requestDetail.RequestId" :items="RequestId" label="Request Type"
                                        outlined color="yellow darken-2" required></v-select>
                                    <span v-if="formSubmitted && !requestDetail.RequestId" class="red--text">Request Type
                                        Must Not Be Empty</span>
                                </v-col>
                                <v-col cols="6">
                                    <v-text-field v-model="requestDetail.RequesterName" label="Requester Name" outlined
                                        color="yellow darken-2" required></v-text-field>
                                    <span v-if="formSubmitted && !requestDetail.RequesterName" class="red--text">Requester
                                        Name Details Must Not Be Empty</span>
                                </v-col>
                                <v-col cols="6">
                                    <v-select v-model="requestDetail.ManagerId" :items="manager" label="Manager" outlined
                                        color="yellow darken-2" required></v-select>
                                    <span v-if="formSubmitted && !requestDetail.ManagerId" class="red--text">Manager Must
                                        Not Be Empty</span>
                                </v-col>
                                <v-col cols="6">
                                    <v-text-field v-model="requestDetail.RequestImplementationDate"
                                        label="Implementation Date" type="date" :rules="[pastDateRule]" outlined
                                        color="yellow darken-2" required></v-text-field>
                                    <span v-if="formSubmitted && !requestDetail.RequestImplementationDate"
                                        class="red--text">Implementation Date Must Not Be Empty</span>
                                </v-col>
                            </v-row>
                            <v-btn type="submit" color="yellow darken-2">Create Request</v-btn>
                        </v-form>
                    </v-expansion-panel-content>
                    <v-expansion-panel :key="'created-panel'">
                        <v-expansion-panel-header>Created Panel</v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <div class="search-bar-container">
                                <v-text-field color="yellow darken-2" v-model="search" label="Search Requests" outlined
                                    dense hide-details class="search-bar"></v-text-field>
                            </div>

                            <v-data-table :headers="headers" :items="userRequestsWithStatusText" :items-per-page="10">
                                <template v-slot:item="{ item }">
                                    <tr @click="selectRow(item)">
                                        <td>{{ item.requestDate }}</td>
                                        <td>{{ item.reasonForRequest }}</td>
                                        <td>{{ item.requestImplementationDate }}</td>
                                        <td>{{ item.statusText }}</td>
                                        <td>
                                            <v-icon size="Extra large" @click="openAssignDialog(item)"
                                                :disabled="item.statusId === 2 || item.statusId === 3 || item.statusId === 4">
                                                mdi-pencil
                                            </v-icon>
                                            <v-icon size="Extra Large" @click=" openDeleteDialog(item)"
                                                :disabled="item.statusId === 2 || item.statusId === 3 || item.statusId === 4">
                                                mdi-delete
                                            </v-icon>
                                            <v-icon size="Extra Large" @click="openReport(item)">mdi-information</v-icon>

                                        </td>
                                    </tr>
                                </template>
                            </v-data-table>


                            <v-dialog v-model="showEditDialog" transition="dialog-bottom-transition" max-width="1500">
                                <v-card>
                                    <v-card-title>Edit Request</v-card-title>
                                    <v-card-text>
                                        <v-form>
                                            <v-row>
                                                <v-col cols="6">
                                                    <v-text-field v-model="requestDetail.RequestDetailsName"
                                                        label="Request Details" outlined color="yellow darken-2"
                                                        required></v-text-field>
                                                    <span v-if="formSubmitted && !requestDetail.RequestDetailsName"
                                                        class="red--text">Request Details Must Not Be Empty </span>
                                                </v-col>
                                                <v-col cols="6">
                                                    <v-text-field v-model="requestDetail.ReasonForRequest"
                                                        label="Reason For Request" outlined color="yellow darken-2"
                                                        required></v-text-field>
                                                    <span v-if="formSubmitted && !requestDetail.ReasonForRequest"
                                                        class="red--text">Reason
                                                        For Request Must Not Be Empty</span>
                                                </v-col>
                                            </v-row>
                                            <v-row>
                                                <v-col cols="6">
                                                    <v-select v-model="requestDetail.RequestId" :items="RequestId"
                                                        label="Request Type" outlined color="yellow darken-2"
                                                        required></v-select>
                                                    <span v-if="formSubmitted && !requestDetail.RequestId"
                                                        class="red--text">Request Type
                                                        Must Not Be Empty</span>
                                                </v-col>
                                                <v-col cols="6">
                                                    <v-text-field v-model="requestDetail.RequesterName"
                                                        label="Requester Name" outlined color="yellow darken-2"
                                                        required></v-text-field>
                                                    <span v-if="formSubmitted && !requestDetail.RequesterName"
                                                        class="red--text">Requester
                                                        Name Details Must Not Be Empty</span>
                                                </v-col>
                                                <v-col cols="6">
                                                    <v-select v-model="requestDetail.ManagerId" :items="manager"
                                                        label="Manager" outlined color="yellow darken-2"
                                                        required></v-select>
                                                    <span v-if="formSubmitted && !requestDetail.ManagerId"
                                                        class="red--text">Manager Must
                                                        Not Be Empty</span>
                                                </v-col>
                                                <v-col cols="6">
                                                    <v-text-field v-model="requestDetail.RequestImplementationDate"
                                                        label="Implementation Date" type="date" :rules="[pastDateRule]"
                                                        outlined color="yellow darken-2" required></v-text-field>
                                                    <span v-if="formSubmitted && !requestDetail.RequestImplementationDate"
                                                        class="red--text">Implementation Date Must Not Be Empty</span>
                                                </v-col>
                                            </v-row>
                                        </v-form>
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-btn color="yellow darken-2" @click="UpdateRequest">Update</v-btn>
                                        <v-btn color="yellow darken-2" @click="showEditDialog = false">Close</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>

                            <v-dialog v-model="ReportDial" transition="dialog-bottom-transition" max-width="1200">
                                <v-card>
                                    <v-card-title class="headline">Report Details</v-card-title>
                                    <v-divider></v-divider>
                                    <v-card-text>
                                        <v-container>
                                            <v-row v-if="userRequests.length > 0">
                                                <v-col cols="12">
                                                    <v-data-table :headers="reportTitles"
                                                        :items="userRequestsWithStatusText" item-key="requestDetailId">
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
                                        <v-btn @click="Report">Download</v-btn>
                                        <v-btn @click="ReportDial = false">Close</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>



                            <v-dialog v-model="deleteDialog" transition="dialog-bottom-transition" max-width="600">
                                <v-card>
                                    <v-card-title>Delete Request</v-card-title>
                                    <v-card-text>
                                        Are You Sure You Want To Delete This Request
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-btn color="yellow darken-2" @click="deleteRequest">Delete</v-btn>
                                        <v-btn color="yellow darken-2" @click="deleteDialog = false">Close</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panel>
            </v-expansion-panels>
        </v-main>
        <v-snackbar v-model="snackbar" :timeout="snackbarTimeout" color="success">
            {{ snackbarMessage }}
            <v-btn text @click="snackbar = false">Close</v-btn>
        </v-snackbar>
    </v-app>
</template>
  
  
  
<script>
import axios from 'axios';
import { mapState } from 'vuex';


export default {
    data() {
        return {
            panel: [0, 1],
            disabled: false,
            readonly: false,
            showAssignDialog: false,
            showEditDialog: false,
            deleteDialog: false,
            updateDialog: false,
            editFormData: {},
            formSubmitted: false,
            ReportDial: false,
            requestDetail: {
                RequestId: '',
                RequestDetailsName: '',
                ReasonForRequest: '',
                RequesterName: '',
                ManagerId: null,
                RequestDate: null,
                userId: null,
                RequestImplementationDate: null,
            },
            reportDialog: false,
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

            userRequests: [],
            titles: ['Date', 'Reason', 'Implentation Date', 'Status'],
            headers: [
                { text: 'Request Date', value: 'requestDate', sortable: false },
                { text: 'Reason for Request', value: 'reasonForRequest', sortable: false },
                { text: 'Implentation Date', value: 'requestImplementationDate', sortable: false },
                { text: 'Status', value: 'statusId', sortable: false },
                { text: 'Actions', sortable: false }
            ],
            RequestId: [
                { text: "Server Repair", value: 1 },
                { text: "New Development", value: 2 },
                { text: "Enhancement", value: 3 },
                { text: "Data", value: 4 },
                { text: "Other", value: 5 },
                { text: "Reporting", value: 6 },
                { text: "Desktop Support", value: 7 },
                { text: "Installation", value: 8 },
                { text: "Statistics", value: 9 },
                { text: "Testing", value: 10 },
                { text: "Maintenance", value: 11 },
                { text: "Update", value: 12 },
                { text: "Upload", value: 13 },
                { text: "Implementation", value: 14 },
                { text: "Replacement", value: 15 },
                { text: "Shutdown", value: 16 },
                { text: "System Patches", value: 17 },
                { text: "Reboot", value: 18 },
                { text: "Advertising", value: 19 },
                { text: "DataMove", value: 20 },
                { text: "Patching And Server Reboot", value: 21 },
                { text: "Upgrade", value: 22 },
                { text: "Server Setup", value: 23 },
                { text: "Decommission", value: 24 },
                { text: "Patching", value: 25 },
                { text: "Deployment", value: 26 },
                { text: "New Server", value: 27 },
                { text: "Rename", value: 28 },
                { text: "Publication", value: 29 },
                { text: "Server Repair 2", value: 30 },
                { text: "DiskMerging", value: 31 }
            ],
            manager: [{ text: "Oupa Lekalakala", value: 1 }, { text: "Sinethemba Vitsha", value: 2 }],
        };
    },
    methods:
    {
        async CreateChangeRequest() {
            try {
                console.log('Creating request...');
                const requestData = this.showEditDialog ? this.editFormData : this.requestDetail;

                requestData.RequestDate = new Date().toISOString().split('T')[0];

                const response = await axios.post('https://localhost:7072/api/RequestDetails/CreateChangeRequest', requestData);
                console.log(response)
                this.fetchUserRequests();
                this.resetForm();
            } catch (error) {
                console.error('An Error Occurred:', error);
            }
        },
        resetForm() {
            this.requestDetail = {
                RequestId: '',
                RequestDetailsName: '',
                ReasonForRequest: '',
                RequesterName: '',
                ManagerId: null,
                RequestDate: null,
                userId: null,
                RequestImplementationDate: null,
            };
            this.formSubmitted = false;
        },
        async submitForm() {
            this.formSubmitted = true;

            if (this.isFormValid) {
                try {
                    const requestData = this.requestDetail;

                    requestData.RequestDate = new Date().toISOString().split('T')[0];

                    requestData.RequestImplementationDate = new Date(requestData.RequestImplementationDate).toISOString().split('T')[0];

                    const response = await axios.post('https://localhost:7072/api/RequestDetails/CreateChangeRequest', requestData);
                    console.log(response)
                    this.fetchUserRequests();
                    this.resetForm();

                } catch (error) {
                    console.error('An error occurred while creating change request:', error);
                }
            } else {
                console.error('Form submission failed: Some fields are empty');
            }
        },
        async fetchUserRequests() {
            try {
                const userId = this.$store.state.userId;
                const response = await axios.get(`https://localhost:7072/api/RequestDetails/GetAllChangeRequest?userId=${userId}`);
                if (response.status === 200) {
                    this.userRequests = response.data;
                } else {
                    console.error('Failed To Fetch Change Requests:', response.data);
                }
            } catch (error) {
                console.error('An Error Occurred While Fetching Change Requests:', error);
            }
        },
        async deleteRequest() {
            try {
                if (!this.selectedItem) {
                    console.error('No row selected.');
                    return;
                }
                const requestDetailsId = this.selectedItem;

                console.log(requestDetailsId)
                const response = await axios.delete(`https://localhost:7072/api/RequestDetails/${requestDetailsId}`);
                console.log(response)
                this.fetchUserRequests();
                this.deleteDialog = false;
                this.showSnackbar('Request successfully Deleted.');
            } catch (error) {
                console.error('An error occurred while deleting the request:', error);
            }
        },

        async UpdateRequest() {
            try {
                if (!this.selectedItem) {
                    console.error('No row selected.');
                    return;
                }
                const requestDate = new Date().toISOString().split('T')[0]; // Current date

                const response = await axios.put(`https://localhost:7072/api/RequestDetails/update/${this.selectedItem}`,
                    {
                        requestDetailsName: this.requestDetail.RequestDetailsName,
                        reasonForRequest: this.requestDetail.ReasonForRequest,
                        requesterName: this.requestDetail.RequesterName,
                        requestDate: requestDate,
                        requestImplementationDate: this.requestDetail.RequestImplementationDate,
                        RequestType: this.requestDetail.RequestId,
                        statusId: this.requestDetail.statusId
                    });
                const updatedRequest = response.data;
                this.showEditDialog = false;
                console.log('Request Updated Successfully:', updatedRequest);
                this.fetchUserRequests();
                this.resetForm();
                this.showSnackbar('Request updated successfully.');


            }
            catch (error) {
                console.error('An Error Occurred While Update The Change Request:', error);
            }
        },


        async Report() {
            try {
                const userId = this.$store.state.userId;
                const response = await axios.get(`https://localhost:7072/api/RequestDetails/GetAllChangeRequest?userId=${userId}`);

                if (response.status === 200) {
                    this.userRequests = response.data;
                    this.ReportDial = true;
                } else {
                    console.error('Failed To Fetch Change Requests:', response.data);
                }
            }
            catch (error) {
                console.error('An error occurred while fetching change requests:', error);
            }
        },
        selectRow(item) {
            this.selectedItem = item.requestDetailId;

            console.log(this.selectedItem)
        },
        openAssignDialog(item) {
            this.selectedItem = item;
            this.editFormData = { ...item };
            this.showEditDialog = true;
        },
        openReport(item) {
            this.selectedItem = item;
            this.ReportDial = true;
        },
        openDeleteDialog(item) {
            this.selectedItem = item;
            this.deleteDialog = true
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

        pastDateRule(value) {
            if (value === null) {
                return true;
            }

            const selectedDate = new Date(value);
            const currentDate = new Date();
            const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
            if (selectedDate < today) {
                return 'Selected Date Cannot Be In The Past';
            }
            return true;
        },

        showSnackbar(message) {
            this.snackbarMessage = message;
            this.snackbar = true;
        }


    },

    mounted() {
        this.fetchUserRequests();
    },

    computed:
    {



        userRequestsWithStatusText() {
            const statusMap = {
                1: 'Pending',
                2: 'Approved by Developer',
                3: 'Approved by Manager',
                4: 'Rejected by Manager'
            };
            return this.userRequests.map(request => {
                return {
                    ...request,
                    statusText: statusMap[request.statusId] || 'Unknown Status'
                };
            });
        },
        isFormValid() {

            return !!this.requestDetail.RequestDetailsName &&
                !!this.requestDetail.ReasonForRequest &&
                !!this.requestDetail.RequestId &&
                !!this.requestDetail.RequesterName &&
                !!this.requestDetail.ManagerId &&
                !!this.requestDetail.RequestImplementationDate;
        },
        ...mapState(['fname']),
        userFirstName() {
            return this.fname;
        }
    },
    created() {
        this.CreateChangeRequest();
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

.search-bar-container {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
    /* Adjust as needed */
}

.search-bar {
    max-width: 300px;
    /* Adjust width as needed */
}
</style>