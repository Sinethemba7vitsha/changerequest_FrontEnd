<template>
    <v-app>
        <v-app-bar app color="yellow darken-2">
            <v-toolbar-title>Developer</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn @click="logoutUser" color="white" text>
                Logout
            </v-btn>
        </v-app-bar>
        <v-main>
            <v-expansion-panels v-model="panel" :disabled="disabled" multiple>
                <v-expansion-panel>
                    <v-expansion-panel-header>Developer Approval Terminal</v-expansion-panel-header>
                    <v-expansion-panel-content :key="'form-panel'" v-model="requestsPanelOpen">
                        <v-card>
                            <v-data-table :headers="headers" :items="managerRequests" @click:row="selectRow">
                                <v-divider class="mx-4" inset vertical></v-divider>
                                <v-spacer></v-spacer>
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
                                    <v-card-title>Assign Developers Module</v-card-title>
                                    <v-card-text>
                                        <v-form>
                                            <v-row>
                                                <v-col cols="12">
                                                    <v-select v-model="DeveloperRequest.ModuleId" :items="ModuleId" outlined
                                                        dense label="Module"></v-select>
                                                    <v-select v-model="DeveloperRequest.SubModuleId" :items="SubModuleId"
                                                        outlined dense label="SubModule"></v-select>
                                                </v-col>
                                            </v-row>
                                            <v-row>
                                                <v-col cols="12">
                                                    <v-select v-model="DeveloperRequest.DeveloperId" :items="Developer"
                                                        outlined dense label="Developer"></v-select>
                                                </v-col>
                                            </v-row>
                                            <v-row>
                                                <v-col cols="12">
                                                    <v-textarea v-model="DeveloperRequest.changeRequest" outlined dense
                                                        label="Change Request"></v-textarea>
                                                </v-col>
                                            </v-row>
                                        </v-form>
                                    </v-card-text>
                                    <v-card-actions>

                                        <v-btn color="yellow darken-2" @click="CreateRequest">Submit</v-btn>
                                        <v-btn color="yellow darken-2" @click="showAssignDialog = false">Close</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </v-card>
                    </v-expansion-panel-content>

                    <v-expansion-panel-header>Assigned Modules</v-expansion-panel-header>
                    <v-expansion-panel-content>

                        <v-card>
                            <div class="search-bar-container">
                                <v-text-field color="yellow darken-2" v-model="search" label="Search Requests" outlined
                                    dense hide-details class="search-bar"></v-text-field>
                            </div>
                            <v-data-table :headers="assignedRequestHeaders" :items="assignedRequests"
                                @click:row="selectRow">
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
                                            <!-- <v-icon size="small" @click="openDeleteDialog(item)"> mdi-delete </v-icon>  come back to it-->

                                        </td>
                                    </tr>
                                </template>
                            </v-data-table>

                            <v-dialog v-model="showEditDialog" transition="dialog-bottom-transition" max-width="600">
                                <v-card>
                                    <v-card-title>Edit Developers Module</v-card-title>
                                    <v-card-text>
                                        <v-form>
                                            <v-row>
                                                <v-col cols="12">
                                                    <v-select v-model="DeveloperRequest.ModuleId" :items="ModuleId" outlined
                                                        dense label="Module"></v-select>
                                                    <v-select v-model="DeveloperRequest.SubModuleId" :items="SubModuleId"
                                                        outlined dense label="SubModule"></v-select>
                                                </v-col>
                                            </v-row>
                                            <v-row>
                                                <v-col cols="12">
                                                    <v-select v-model="DeveloperRequest.DeveloperId" :items="Developer"
                                                        outlined dense label="Developer"></v-select>
                                                </v-col>
                                            </v-row>
                                            <v-row>
                                                <v-col cols="12">
                                                    <v-textarea v-model="DeveloperRequest.changeRequest" outlined dense
                                                        label="Change Request"></v-textarea>
                                                </v-col>
                                            </v-row>
                                        </v-form>
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-btn @click="editModule">Submit</v-btn>
                                        <v-btn @click="showEditDialog = false">Close</v-btn>
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
                                        <v-btn color="yellow darken-2" @click="DeleteRequest">Submit</v-btn>
                                        <v-btn color="yellow darken-2" @click="deleteDialog = false">Close</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </v-card>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </v-main>
        <v-snackbar v-model="snackbar" :timeout="timeout" :color="snackbarColor">
            {{ snackbarMessage }}
            <v-btn text @click="closeSnackbar">Close</v-btn>
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
            managerRequests: [],
            showAssignDialog: false,
            assignedRequests: [],
            showEditDialog: false,
            deleteDialog: false,
            formSubmitted: false,
            showDeleteConfirmationDialog: false,
            titles: ['Date', 'Requester Name', 'Reason', 'Status'],
            headers: [
                { text: 'Request Date', value: 'requestDate' },
                { text: 'Requester Name', value: 'requesterName' },
                { text: 'Reason for Request', value: 'reasonForRequest' },
                { text: 'Status', value: 'statusId' },
                { text: 'Actions', value: 'actions', sortable: false },
            ],
            assignedRequestHeaders: [
                { text: 'Request Date', value: 'requestDate' },
                { text: 'Requester Name', value: 'requesterName' },
                { text: 'Reason for Request', value: 'reasonForRequest' },
                { text: 'Status', value: 'statusId' },
                { text: 'Actions', value: 'actions', sortable: false }
            ],
            DeveloperRequest: {
                ModuleId: '',
                SubModuleId: '',
                DeveloperId: '',
                changeRequest: ''
            },
            Developer: [
                { text: "Sinethemba Vitsha", value: 1 },
                { text: "Thabisa Gwiji", value: 2 },
            ],
            ModuleId: [
                { text: "Web Admin System", value: 1 },
                { text: "DEEC", value: 2 },
                { text: "SCM", value: 3 },
                { text: "Reference", value: 4 },
                { text: "Registers", value: 5 },
                { text: "ICT", value: 6 },
                { text: "GDV", value: 7 },
                { text: "KPC", value: 8 },
                { text: "Licence Application RFI Module", value: 9 },
                { text: "SADPMR Website", value: 10 },
                { text: "Payroll", value: 11 },
                { text: "New Development", value: 12 },
                { text: "GIMP", value: 13 },
                { text: "Intranet", value: 14 },
                { text: "Precious Metals and Beneficiation Registers", value: 15 },
                { text: "SADPMR Website and Intranet", value: 16 },
                { text: "Intranet", value: 17 },
                { text: "Server", value: 18 },
                { text: "SADPMRMAIL", value: 19 },
                { text: "Telkom Teltrace", value: 20 },
                { text: "Pastel", value: 21 },
                { text: "Shutdown", value: 22 },
                { text: "New Web Admin", value: 23 },
                { text: "SADPMR Cluster", value: 24 },
                { text: "Patches", value: 25 },
                { text: "SADPMR Website and Intranet", value: 26 },
                { text: "Communication", value: 27 },
                { text: "SAPMRSQL Server", value: 28 },
                { text: "SADPMRPDC", value: 29 },
                { text: "SQL VIP", value: 30 },
                { text: "SADPMR NEW WEB ADMIN", value: 31 },
                { text: "FEP Antivirus", value: 34 },
                { text: "Supplier's Database", value: 36 },
                { text: "Web Admin Portal", value: 37 },
                { text: "Web Admin (Interim)", value: 38 },
                { text: "JHBVSQLSQI", value: 39 },
                { text: "JHBSRVDQI", value: 40 },
                { text: "Exchange", value: 41 },
                { text: "Certificate services", value: 42 },
                { text: "SADPMRBDC", value: 43 },
                { text: "JHBVCCMSQL", value: 44 },
                { text: "Sage VIP", value: 45 },
                { text: "SAGE EVOLUTION", value: 46 },
                { text: "Server Patching", value: 47 },
                { text: "DR Servers", value: 48 },
                { text: "Workstations", value: 49 },
                { text: "Bidding Portal", value: 50 },
                { text: "Access Import&Export", value: 51 },
                { text: "Intranet & Website", value: 52 },
                { text: "Install SCCM", value: 53 },
                { text: "Exchange Server", value: 54 },
                { text: "Test", value: 55 },
                { text: "JHBVSQLS01", value: 56 },
            ],
            SubModuleId: [
                { text: "Email Module", value: 1 },
                { text: "Environment - Publishing", value: 2 },
                { text: "DEEC - Diamond tenders", value: 3 },
                { text: "DEEC - Diamond Tender parcels", value: 4 },
                { text: "DEEC - Diamond Tender Viewing", value: 5 },
                { text: "DEEC - Diamond Tender Bidding Transactions", value: 6 },
                { text: "DEEC - Seller Reserve Price Capture Screen", value: 7 },
                { text: "DEEC - Seller Bid Acceptance capture screen", value: 8 },
                { text: "DEEC - Reporting Module", value: 9 },
                { text: "DEEC - Perpetual Tender", value: 10 },
                { text: "DEEC - Scanning - Viewing Transaction", value: 11 },
                { text: "DEEC - Scanning - Seller reserve Pricing", value: 12 },
                { text: "DEEC - Scanning - Bidding", value: 13 },
                { text: "DEEC - Scanning - Bidding", value: 14 },
                { text: "DEEC - Scanning - Seller Bid Acceptance", value: 15 },
                { text: "DEEC - DEEC Export Transaction", value: 16 },
                { text: "Licensing - Authorised Representative Certificates", value: 17 },
                { text: "Licensing - Certificate Print", value: 18 },
                { text: "Licensing - Licence Applications Capture", value: 19 },
                { text: "Licensing - Client", value: 20 },
                { text: "Licensing - Authorised Reps", value: 21 },
                { text: "Licensing - Licence Reporting", value: 22 },
                { text: "Reference - User Access control", value: 23 },
                { text: "Reference - General", value: 24 },
                { text: "Registers - Main Module", value: 25 },
                { text: "DEEC Import/Export Module", value: 26 },
                { text: "ICT - System Change Request", value: 27 },
                { text: "GDV-import/export", value: 28 },
                { text: "KPC Data", value: 29 },
                { text: "Generate RFI's and RFP's", value: 30 },
                { text: "SADPMR Website", value: 31 },
                { text: "MasterPage", value: 32 },
                { text: "ESS", value: 33 },
                { text: "HR Policies", value: 34 },
                { text: "Advertised Bid", value: 35 },
                { text: "Bid Result", value: 36 },
                { text: "Vacancies", value: 37 },
                { text: "Invoice Tracking", value: 38 },
                { text: "Storeroom System", value: 39 },
                { text: "GIMP Graphics", value: 40 },
                { text: "Communication - Events", value: 41 },
                { text: "Manufactured Article", value: 42 },
                { text: "Website and Intranet", value: 43 },
                { text: "Intranet Publishing", value: 44 },
                { text: "VIP Update", value: 45 },
                { text: "Exchange", value: 46 },
                { text: "DEEC - Reports", value: 47 },
                { text: "Telkom Software Upgrade", value: 48 },
                { text: "HR Leave Form", value: 49 },
                { text: "Pastel Addition", value: 50 },
                { text: "Servers", value: 51 },
                { text: "Mail", value: 52 },
                { text: "Host", value: 53 },
                { text: "General Ledger Structure", value: 54 },
                { text: "GL Account", value: 55 },
                { text: "Account Receivable", value: 56 },
                { text: "Reporting Requirements", value: 57 },
                { text: "Deployment to Production", value: 58 },
                { text: "Infosec Account", value: 59 },
                { text: "Advertisement", value: 60 },
                { text: "Carat Affairs", value: 61 },
                { text: "Cluster", value: 62 },
                { text: "Board Calendar", value: 63 },
                { text: "Customers/Clients", value: 64 },
                { text: "ICT Documents", value: 65 },
                { text: "DEEC 2014 Year Planner", value: 66 },
                { text: "Reboot Server", value: 67 },
                { text: "HR Documentation", value: 68 },
                { text: "Notice for Renewal", value: 69 },
                { text: "Data", value: 70 },
                { text: "Server", value: 71 },
                { text: "Patching", value: 72 },
                { text: "Document Library/Legislation", value: 73 },
                { text: "Annual Report", value: 74 },
                { text: "Documents Library", value: 75 },
                { text: "DEEC Bidding Portal", value: 76 },
                { text: "Useful links", value: 77 },
                { text: "Executive Management", value: 78 },
                { text: "Home Page", value: 79 },
                { text: "GDV Added parcels", value: 80 },
                { text: "Thoughts of the week", value: 81 },
                { text: "About Us", value: 82 },
                { text: "Backup Exec", value: 83 },
                { text: "Licensing-RFI", value: 84 },
                { text: "Intranet Pictures", value: 85 },
                { text: "Setup", value: 87 },
                { text: "Add parcel", value: 88 },
                { text: "Monthly communication", value: 89 },
                { text: "Thoughts of the day", value: 90 },
                { text: "Interim Web Admin System", value: 91 },
                { text: "New server", value: 92 },
                { text: "Active Directory", value: 93 },
                { text: "Gallery", value: 94 },
                { text: "VIP", value: 95 },
                { text: "Uninstallation", value: 96 },
                { text: "ESS VIP", value: 97 },
                { text: "Board Committees", value: 98 },
                { text: "Configuration Manager", value: 99 },
                { text: "Payroll", value: 100 },
                { text: "Careers", value: 101 },
                { text: "What do we do", value: 102 },
                { text: "Publication of response received", value: 103 },
                { text: "Closed bids", value: 104 },
                { text: "SAGE Evolution (Pastel)", value: 105 },
                { text: "Web Admin System", value: 106 },
                { text: "JHBVFPSQ1", value: 107 },
                { text: "Create Tender", value: 108 },
                { text: "KIMSRVDQI", value: 109 },
                { text: "JHBPSUS", value: 110 },
                { text: "Diamond Tenders", value: 111 },
                { text: "Domain Certificate", value: 112 },
                { text: "Workstations", value: 113 },
                { text: "Administer Tender", value: 114 },
                { text: "SCM", value: 115 },
                { text: "Exchange rate", value: 116 },
                { text: "Shared Folder", value: 117 },
                { text: "News", value: 118 },
                { text: "Organisational Structure", value: 119 },
                { text: "Careers", value: 120 },
                { text: "Forms", value: 121 },
                { text: "Board Members", value: 122 },
                { text: "Announcement", value: 123 },
                { text: "RFI", value: 124 },
                { text: "Add Licence", value: 125 },
                { text: "Minister Blog", value: 126 },
                { text: "Diamond Registers", value: 127 },
                { text: "Receive Parcel", value: 128 },
                { text: "Licensing", value: 129 },
                { text: "SCM - Awarded Bids", value: 130 },
                { text: "Email Module", value: 131 },
                { text: "SCM-Open Bids", value: 132 },
                { text: "Board Members", value: 133 },
                { text: "Announcement", value: 134 },
                { text: "RFI", value: 135 },
                { text: "Add Licence", value: 136 },
                { text: "Minister Blog", value: 137 },
                { text: "Diamond Registers", value: 138 },
                { text: "Receive Parcel", value: 139 },
                { text: "Licensing", value: 140 },
                { text: "SCM - Awarded Bids", value: 141 },
                { text: "Email Module", value: 142 },
                { text: "SCM-Open Bids", value: 143 }
            ],
            modules: [],
            editedIndex: -1,
            editedItem: {
                ModuleId: '',
                SubModuleId: '',
                DeveloperId: '',
                changeRequest: '',
            },
            defaultItem: {
                ModuleId: '',
                SubModuleId: '',
                DeveloperId: '',
                changeRequest: ''
            },

            snackbar: false,
            snackbarMessage: '',
            snackbarColor: 'success',
            timeout: 5000,

        };

    },
    methods:
    {
        async fetchManagerRequests() {
            try {
                const response = await axiosInstance.get('RequestDetails/GetAllChangeRequest');

                if (response.status === 200) {
                    this.managerRequests = response.data;
                } else {
                    console.error('Failed to fetch change requests:', response.data);
                }
            } catch (error) {
                console.error('An error occurred while fetching change requests:', error);
            }
        },

        async fetchApprovedRequests() {
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
                    const requestsWithStatusText = allRequests.map(request => ({
                        ...request,
                        statusText: statusMap[request.statusId] || 'Unknown Status'
                    }));
                    this.managerRequests = requestsWithStatusText.filter(request => request.statusId === 1);
                    this.assignedRequests = requestsWithStatusText.filter(request => request.statusId === 2);

                } else {
                    console.error('Failed to fetch change requests:', response.data);

                }
            } catch (error) {
                console.error('An error occurred while fetching change requests:', error);
            }
        },
        async CreateRequest() {
            try {
                if (!this.selectedItem) {
                    console.error('No row selected.');
                    return;
                }

                const userId = this.$store.state.userId;

                console.log(this.selectedItem)
                const response = await axiosInstance.post(`ICTUser/CreateICTUser/${this.selectedItem}`,
                    {
                        ModuleId: this.DeveloperRequest.ModuleId,
                        SubModuleId: this.DeveloperRequest.SubModuleId,
                        DeveloperId: this.DeveloperRequest.DeveloperId,
                        changeRequest: this.DeveloperRequest.changeRequest
                    }
                )
                console.log(response)
                this.showAssignDialog = false;
                this.fetchManagerRequests();
                this.fetchApprovedRequests();
                this.resetForm();

                this.showSuccessSnackbar('Modules assigned successfully');


            }
            catch (error) {
                console.error('An error occurred while fetching change requests:', error);
                this.showErrorSnackbar('Failed to assign modules');
            }
        },

        async DeleteRequest() {
            try {
                if (!this.selectedItem) {
                    console.error('No row selected.');
                    return;
                }

                const response = await axiosInstance.delete(`ICTUser/ictusers/${this.selectedItem}`);
                if (response.status === 200) {
                    console.log('Request deleted successfully.');
                } else {
                    console.error('Failed to delete the request:', response.data);
                }
            } catch (error) {
                console.error('An error occurred while deleting the request:', error);
            }
        },

        resetForm() {
            this.DeveloperRequest = {
                ModuleId: '',
                SubModuleId: '',
                DeveloperId: '',
                changeRequest: ''
            };
            this.formSubmitted = false;
        },

        async UpdateRequest() {
            try {
                if (!this.selectedItem) {
                    console.error('No row selected.');
                    return;
                }

                const response = await axiosInstance.patch(`ICTUser/ictusers/${this.selectedItem}`, {
                    ModuleId: this.DeveloperRequest.ModuleId,
                    SubModuleId: this.DeveloperRequest.SubModuleId,
                    DeveloperId: this.DeveloperRequest.DeveloperId,
                    changeRequest: this.DeveloperRequest.changeRequest
                });

                console.log(response)
                this.showAssignDialog = false;
                this.fetchManagerRequests();
                this.fetchApprovedRequests();
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
            this.showAssignDialog = true;
        },

        //Open Dialog 
        openDeleteDialog(item) {
            this.selectDeleteDialog = item
            this.deleteDialog = true
        },

        //Log out funtions
        logoutUser() {
            this.$store.dispatch('logout')
                .then(() => {
                    this.$router.push('/');
                })
                .catch((error) => {
                    console.error('Logout failed:', error);
                });
        },
        //this is the showsnack message 
        showSnackbar(message, color) {
            this.snackbarMessage = message;
            this.snackbarColor = color;
            this.snackbar = true;
        },

        //to close the snackbar 
        closeSnackbar() {
            this.snackbar = false;
        },

        // to show the snackbar 
        showSuccessSnackbar(message) {
            this.showSnackbar(message, 'success');
        },

        // Method to show an error snackbar
        showErrorSnackbar(message) {
            this.showSnackbar(message, 'error');
        },


    },
    mounted() {
        this.fetchManagerRequests();
        this.fetchApprovedRequests();
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
            return !!this.DeveloperRequest.ManagerId &&
                !!this.DeveloperRequest.SubModuleId &&
                !!this.DeveloperRequest.DeveloperId &&
                !!this.DeveloperRequest.changeRequest
        },
    },
}

</script>

<style scoped>
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
</style>Services/axios