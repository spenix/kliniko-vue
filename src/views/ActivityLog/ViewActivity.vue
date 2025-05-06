<template>
  <b-container fluid>
    <b-row>
      <b-col lg="12">
        <iq-card class-name="iq-user-profile-block1">
          <template v-slot:body>
            <div class="user-details-block">
              <div class="user-profile text-center">
                <img src="../../assets/images/user/11.png" alt="profile-img" class="avatar-130 img-fluid">
              </div>
              <div class="text-center mt-3">
                <h4><b>{{ detail.patient?.first_name }} {{ detail.patient?.last_name }}</b></h4>
                <p>{{ age }} years, {{ detail.patient?.address_line2 }}</p>
              </div>
            </div>
          </template>
        </iq-card>
      </b-col>
      <b-col lg="12">
        <iq-card body-class="pb-0" >
          <template v-slot:body>
            <b-row>
              <b-col sm="12">
                <iq-card body-class="bg-primary rounded pt-2 pb-2 pr-2" v-show="detail.rc_notes">
                  <template v-slot:body>
                    <div class="d-flex align-items-center justify-content-between">
                      <p class="mb-0">{{ detail.rc_notes }}</p>
                      <div class="rounded iq-card-icon bg-white">
                        <img src="../../assets/images/page-img/37.png" class="img-fluid" alt="icon">
                      </div>
                    </div>
                  </template>
                </iq-card>
                <b-alert :show="detail.patient.balance > 0 && detail.is_paid === 'N' && detail.is_settle_with_balance === 'N' && userDetails?.role != 'DA'" variant=" "  fade class="text-white bg-danger">
                  <div class="iq-alert-icon">
                    <i class="ri-information-line"></i>
                  </div>
                  <div class="iq-alert-text">Patient has an existing balance of {{ detail.patient.balance }}</div>
                </b-alert>
                <b-alert v-for="(d, i) in recomFromPrevAct" :key="`recom-${i}`" :show="true" variant="" class="text-black bg-info">
                  <div class="iq-alert-icon">
                    <i class="las la-comment"></i>
                  </div>
                  <div class="iq-alert-text">
                    <span class="f-w-600">[ {{ d?.treatment }} ] </span> {{ d?.next_visit_recom }}
                    <a href="javascript:;" class="float-right" @click="hideRecommendation(d)">Hide</a>
                  </div>
                </b-alert>
                <div class="iq-card">
                  <div class="iq-header-title">
                    <h4 class="card-title text-primary">Treatment Log</h4>
                  </div>
                  <div class="iq-card-body pl-0 pr-0 pb-0">
                    <div class="d-flex align-items-center justify-content-between" >
                      <div class="col-12 col-md-6" v-if="showSelectionOfDentist && detail.is_dentist_required">
                        <label for="selectdoctor">Dentist</label>
                        <Multiselect
                          v-model="selectedDoctor"
                          id="selectdoctor"
                          label="text"
                          track-by="value"
                          placeholder="Enter Dentist"
                          :options="doctors"
                          :searchable="true"
                          :loading="isLoading"
                          @search-change="fetchDoctorList"
                          @select="onSelect"
                          >
                          <span slot="noOptions">Enter Dentist</span>
                          </Multiselect>
                      </div>
                      <!-- <b-form-group class="col-12 col-md-6" label="Dentist" label-for="selectdoctor" v-if="showSelectionOfDentist && detail.is_dentist_required">
                        <b-form-select v-model="detail.doctor_id"  plain :options="doctors" id="selectdoctor">
                          <template v-slot:first>
                            <b-form-select-option :value="null">Select Dentist</b-form-select-option>
                          </template>
                        </b-form-select>
                      </b-form-group> -->
                      <div class="col-12 col-md-6" v-if="(!showSelectionOfDentist) && detail.is_dentist_required">
                        <div class="data-block">
                          <p class="mb-0">Assigned Dentist</p>
                          <h5>{{detail.doctor_name ? detail.doctor_name : 'N/A'}}</h5>
                        </div>
                      </div>
                      <b-form-group class="col-12 col-md-6" label="Dental Assistant" label-for="selectdoctor" v-if="(detail.status === 'pending' || detail.status === 'ongoing') && detail.is_dentist_required">
                        <b-form-input id="dental_assistant" v-model="dental_assistant" type="text" placeholder="Enter D.A On Duty" :required="detail.is_dentist_required"></b-form-input>
                      </b-form-group>
                      <div class="col-12 col-md-6" v-if="(!(detail.status === 'pending' || detail.status === 'ongoing')) && detail.is_dentist_required">
                        <div class="data-block">
                          <p class="mb-0">Dental Assistant</p>
                          <h5>{{detail.dental_assistant ? detail.dental_assistant : 'N/A'}}</h5>
                        </div>
                      </div>
                    </div>
                    <div class="row mt-4 mb-2" v-if="detail.status !== 'cancelled'">
                      <div class="col-12 col-md-6">
                        <b-button v-b-modal.prescription-modal class="mx-1 my-2" variant="success" @click="actionPrescriptionItem('', 'Add')">+ Prescription</b-button>
                        <b-button v-b-modal.modal-attachment class="mx-1 my-2" variant="warning" @click="actionAttachmentItem('', 'Add')">+ Attachment</b-button>
                        <b-button v-b-modal.modal-recommendation class="mx-1 my-2" variant="info" @click="actionRecommendationItem('', 'Add')" v-show="detail.is_dentist_required && userDetails?.role == 'DA'">+ Recommendation</b-button>
                      </div>
                      <div class="col-12 col-md-6">
                        <b-button v-b-modal.modal-add-procedure class="float-right my-2" variant="primary" v-show="detail.is_paid === 'N' && detail.is_settle_with_balance === 'N'" @click="clearServicesForm()">Add Service</b-button>
                      </div>
                    </div>
                    <b-row  v-show="detail.services.length">
                      <b-col md="12"><h4>Services</h4></b-col>
                      <b-col md="12">
                        <b-table
                          striped
                          hover
                          :small="small"
                          outlined
                          :fields="fields"
                          :items="servicesList"
                        >
                        <template v-slot:cell(service_name)="{ item }">
                          <span v-if="item?.is_delete === 'N' && item?.is_voided === 'N'">{{ item?.service_name }}</span>
                          <span v-else><s>{{ item?.service_name }}</s></span>
                        </template>
                        <template v-slot:cell(amount)="{ item }">
                          <span v-if="item?.is_delete === 'N' && item?.is_voided === 'N'">{{ item?.amount }}</span>
                          <span v-else><s>{{ item?.amount }}</s></span>
                        </template>
                        <template v-slot:cell(commission_amount)="{ item }">
                          <span v-if="item?.is_delete === 'N' && item?.is_voided === 'N'">{{ item?.commission_amount + ` ${item.reason_to_update_commission ?? '' }` }}</span>
                          <span v-else><s>{{ item?.commission_amount + ` ${item.reason_to_update_commission ?? '' }` }}</s></span>
                        </template>
                        <template v-slot:cell(remarks)="{ item }">
                            <span>{{ item.remarks }} <i class="las la-edit mx-1" style="cursor: pointer;" role="button" @click="editRemarks(item)" title="Edit Remarks"></i></span>
                        </template>
                        <template v-slot:cell(actions)="{ item }">
                          <span class="mx-1 my-1" v-if="item?.is_delete === 'N' && item?.is_voided === 'N' && detail.status === 'done' && (userDetails?.role == 'OM' || userDetails?.role == 'AD' || userDetails?.role == 'RC')"><b-btn size="sm" variant="primary" title="Edit Commission Amount" @click="actionEditCommissionAmtService(item)"><i class="las la-edit"></i> Edit Commission</b-btn></span>
                          <span class="mx-1 my-1" v-if="item?.is_delete === 'N' && item?.is_voided === 'N' && detail.status !== 'done'"><b-btn size="sm" variant="danger" title="Delete" @click="actionDelServiceAvail(item)"><i class="las la-trash"></i> Cancel</b-btn></span>
                          <span class="mx-1 my-1" v-else-if="item?.is_delete === 'N' && item?.is_voided === 'N' && detail.status === 'done' && (userDetails?.role == 'OM' || userDetails?.role == 'AD')"><b-btn size="sm" variant="danger" title="Void" @click="actionVoidServiceAvail(item)"><i class="las la-trash"></i> Void</b-btn></span>
                          <span class="mx-1 my-1" v-else-if="item?.is_voided === 'Y'">  <span class="badge">Voided | {{ item?.voided_remarks }}</span></span>
                          <span class="mx-1 my-1" v-else-if="item?.is_delete === 'Y'"><span class="badge">Cancelled</span></span>
                        </template>
                        </b-table>
                      </b-col>
                    </b-row>
                    <b-row  v-if="recommendations?.total">
                      <b-col md="12"><h4>Recommendations</h4></b-col>
                      <b-col md="12">
                        <b-table
                          striped
                          hover
                          :small="small"
                          outlined
                          :fields="recommendationFields"
                          :items="recommendations.data"
                        >
                        <template v-slot:cell(actions)="{ item }">
                          <span><b-btn size="sm" class="m-1" variant="primary" v-b-modal.modal-recommendation title="Edit" @click="actionRecommendationItem(item, 'Edit')"><i class="las la-edit"></i> Edit</b-btn></span>
                          <span><b-btn size="sm" class="m-1" variant="danger" title="Remove" @click="actionRecommendationItem(item, 'Remove')"><i class="las la-trash"></i> Remove</b-btn></span>
                        </template>
                        </b-table>
                      </b-col>
                      <b-col md="12" v-if="recommendations?.last_page > 1">
                        <b-pagination
                        class="float-right"
                        v-model="recommendationCurrentPage"
                        prev-text="Previous"
                        next-text="Next"
                        first-text="First"
                        last-text="Last"
                        :total-rows="recommendations?.total"
                        :per-page="recommendations?.per_page"
                        aria-controls="my-table"
                        ></b-pagination>
                      </b-col>
                    </b-row>
                    <b-row  v-if="attachments?.total">
                      <b-col md="12"><h4>Attachments</h4></b-col>
                      <b-col md="12">
                        <b-table
                          striped
                          hover
                          :small="small"
                          outlined
                          :fields="attachmentFields"
                          :items="attachments.data"
                        >
                        <template v-slot:cell(actions)="{ item }">
                          <span><b-btn size="sm" variant="warning" title="View" @click="actionAttachmentItem(item, 'View')"><i class="las la-user"></i> View</b-btn></span>
                        </template>
                        </b-table>
                      </b-col>
                      <b-col md="12" v-if="attachments?.last_page > 1">
                        <b-pagination
                        class="float-right"
                        v-model="attachmentCurrentPage"
                        prev-text="Previous"
                        next-text="Next"
                        first-text="First"
                        last-text="Last"
                        :total-rows="attachments?.total"
                        :per-page="attachments?.per_page"
                        aria-controls="my-table"
                        ></b-pagination>
                      </b-col>
                    </b-row>
                    <b-row  v-if="prescriptions?.total">
                      <b-col md="12"><h4>Prescriptions</h4></b-col>
                      <b-col md="12">
                        <b-table
                          striped
                          hover
                          :small="small"
                          outlined
                          :fields="prescriptionFields"
                          :items="prescriptions.data"
                        >
                        <template v-slot:cell(actions)="{ item }">
                          <span><b-btn size="sm" class="mx-1" variant="warning" v-b-modal.prescription-modal title="View" @click="actionPrescriptionItem(item, 'View')"><i class="las la-user"></i> View</b-btn></span>
                          <span><b-btn size="sm" class="mx-1" variant="light" v-b-modal.print-prescription-modal title="Generate" @click=" actionPrescriptionItem(item, 'Print')"><i class="las la-print"></i> Print</b-btn></span>
                        </template>
                        </b-table>
                      </b-col>
                      <b-col md="12" v-if="prescriptions?.last_page > 1">
                        <b-pagination
                        class="float-right"
                        v-model="prescriptionCurrentPage"
                        prev-text="Previous"
                        next-text="Next"
                        first-text="First"
                        last-text="Last"
                        :total-rows="prescriptions?.total"
                        :per-page="prescriptions?.per_page"
                        aria-controls="my-table"
                        ></b-pagination>
                      </b-col>
                    </b-row>
                  </div>
                  <div class="row" v-show="detail.is_dentist_required">
                    <b-form-group class="col-md-12" label="Remarks" label-for="remarks">
                      <b-form-textarea v-model="detail.remarks" id="remarks" rows="3" ></b-form-textarea>
                    </b-form-group>
                  </div>
                  <b-row class="mt-4 mb-4" v-if="detail.status !== 'cancelled'">
                    <b-col>
                      <b-button v-show="detail.is_paid === 'N' && detail.is_settle_with_balance === 'N'" v-b-modal.modal-additional-payable class="mx-1" variant="danger" ><i class="ri ri-money-dollar-circle-fill"></i> Additional Payable</b-button>
                    </b-col>
                  </b-row>
                  <b-row  v-show="additionalPayables.length">
                    <b-col md="12">
                      Additional Payable(s)
                    </b-col>
                    <div md-12></div>
                    <b-col md="12">
                      <b-table
                        striped
                        hover
                        :small="small"
                        outlined
                        :fields="additionalPayableFields"
                        :items="additionalPayableList"
                      >
                        <template v-slot:cell(type)="{ item }">
                          <span v-if="item?.is_delete === 'N'">{{ item?.type }}</span>
                          <span v-else><s>{{ item?.type }}</s></span>
                        </template>
                        <template v-slot:cell(amount)="{ item }">
                          <span v-if="item?.is_delete === 'N'">{{ item?.amount }}</span>
                          <span v-else><s>{{ item?.amount }}</s></span>
                        </template>
                        <template v-slot:cell(description)="{ item }">
                          <span v-if="item?.is_delete === 'N'">{{ item?.description }}</span>
                          <span v-else><s>{{ item?.description }}</s></span>
                        </template>
                        <template v-slot:cell(actions)="{ item }">
                          <span v-if="item?.is_delete === 'N' && detail.status !== 'done'"><b-btn size="sm" variant="danger" title="Delete" @click="actionCancelAdditionalPayable(item)"><i class="las la-trash"></i> Cancel</b-btn></span>
                          <span v-else-if="item?.is_delete === 'Y'"><span class="badge">Cancelled</span></span>
                        </template>
                      </b-table>
                    </b-col>
                  </b-row>
                  <div class="row d-flex align-items-center justify-content-between">
                    <b-col sm="12" md="6">
                      <div class="data-block" v-if="(userDetails?.role != 'DA') && detail.is_dentist_required">
                        <p class="mb-0">Dentist Commission <b-button v-show="detail.is_paid === 'N' && detail.is_settle_with_balance === 'N'" v-b-modal.modal-additional-commission variant="warning" title="Additional Commission" v-if="detail.status !== 'cancelled'">+</b-button></p>
                        <h5>{{totalCommission}}</h5>
                        <code v-if="(userDetails?.role != 'DA' && additionalCommissionInfo.amount)">+ addt'l commission: <strong>{{ additionalCommissionInfo.amount }}</strong> ({{ additionalCommissionInfo.remarks }}) <a href="javascript:;" v-show="detail.is_paid === 'N' && detail.is_settle_with_balance === 'N'"><i class="fa fa-trash fa-sm" style="color:red;" title="Delete additional commission" @click="deleteAdditionalCom()"></i></a></code>
                      </div>
                      <div class="data-block" v-if="(userDetails?.role != 'DA' && additionalCommissionInfo.amount) && detail.is_dentist_required">
                        <p class="mb-0">Total Commission</p>
                        <h5>{{totalCommissionWithAdditional}}</h5>
                      </div>
                      <div class="data-block mt-3">
                        <p class="mb-0">Total Amount</p>
                        <h5>{{totalAmount}}</h5>
                        <code v-if="(userDetails?.role != 'DA')"><div  v-for="(item, index) in tenderDiscount" :key="index"><strong>- {{item.discountedAmount}} [{{item.name}}]</strong>  <a href="#" @click="handleRemoveDiscount(index, item.id)"><i v-show="detail.is_paid === 'N' && detail.is_settle_with_balance === 'N'" class="ri-close-circle-fill" style="color:red"></i></a></div></code>
                      </div>
                      <div class="data-block mt-3">
                        <p class="mb-0">Grand Total</p>
                        <h5>{{amountToBePaid}}</h5>
                      </div>
                    </b-col>
                    <b-col sm="12" md="6">
                      <div class="payment-container" v-show="detail.status === 'done'">
                        <div class="payment-types-container">
                          <div class="pct-row" v-for="(item, index) in tenderPayments" :key="index">
                            <div class="pct-row-label"><i @click="deletePayment(index)" class="ri-close-circle-fill" style="color:red"></i> {{item.type}}</div>
                            <div class="pct-row-amount">{{item.amount}}</div>
                          </div>
                          <div class="pct-row">
                            <div class="pct-row-label">TENDERED AMOUNT</div>
                            <div class="pct-row-amount">{{tenderedAmount}}</div>
                          </div>
                        </div>
                        <div class="payment-container-totals">
                          <div class="pct-row">
                            <div class="pct-row-label">BALANCE</div>
                            <div class="pct-row-amount">{{balance}}</div>
                          </div>
                          <div class="pct-row">
                            <div class="pct-row-label">RETURN AMOUNT</div>
                            <div class="pct-row-amount">{{returnAmount}}</div>
                          </div>
                        </div>
                      </div>
                    </b-col>
                  </div>
                  <b-row align-h="between" class="mb-3" v-if="detail.status !== 'cancelled'">
                    <b-col cols="4">
                      <b-button class="mx-2" variant="primary" @click="proceedTreatment()" v-show="detail.status === 'pending'" :disabled='isLoading'>
                        Proceed
                        <b-spinner v-show="isLoading" small></b-spinner>
                      </b-button>
                      <b-button class="mx-2" variant="danger" @click="cancelTreatment()" v-show="detail.status === 'pending'" :disabled='isLoading'>
                        Cancel
                        <b-spinner v-show="isLoading" small></b-spinner>
                      </b-button>
                      <b-button class="mx-2" variant="success" @click="markAsDone()" v-show="detail.status === 'ongoing'" :disabled='isLoading'>
                        Mark as Done
                        <b-spinner v-show="isLoading" small></b-spinner>
                      </b-button>
                      <b-button class="mx-2" variant="success" v-b-modal.modal-add-payment v-show="detail.status === 'done' && (detail.is_paid === 'N' && detail.is_settle_with_balance === 'N' ) && (userDetails?.role != 'DA')">Add Payment</b-button>
                      <b-button class="mx-2" variant="info" v-b-modal.modal-add-discount v-show="detail.status === 'done' && (detail.is_paid === 'N' && detail.is_settle_with_balance === 'N' ) && (userDetails?.role != 'DA')">Add Discount</b-button>
                      <b-button class="mx-2" variant="warning" @click="updateRemarks()" v-show="detail.status === 'done' && userDetails?.role == 'DA'" :disabled='isLoading'>
                        Update Remarks
                        <b-spinner v-show="isLoading" small></b-spinner>
                      </b-button>
                    </b-col>
                    <b-col cols="4">
                      <b-button class="settle-btn" size="lg" variant="warning" @click="settlePayment()" v-show="detail.status === 'done' && balance <= 0 && detail.is_paid === 'N' && (userDetails?.role != 'DA')" :disabled="isLoading">
                        Settle
                        <b-spinner v-show="isLoading" small></b-spinner>
                      </b-button>
                      <b-button variant="danger" @click="settlePaymentWithBalance()" v-show="detail.status === 'done' && balance > 0 && detail.is_paid === 'N' && detail.is_settle_with_balance != 'Y' && (userDetails?.role != 'DA')" :disabled="isLoading">
                        Settle with Balance
                        <b-spinner v-show="isLoading" small></b-spinner>
                      </b-button>
                    </b-col>
                  </b-row>
                  <div class="row" v-else>
                    <div class="col-12 text-center">
                      <h3 > --- {{ (detail.status).toUpperCase() }} ---</h3>
                    </div>
                  </div>
                </div>
              </b-col>
            </b-row>
          </template>
        </iq-card>
      </b-col>
    </b-row>
    <b-modal id="modal-add-procedure" centered :title="service.id ? 'Edit Service Remarks' : 'Add Service'" hide-footer cancel-title="Close">
      <validation-observer ref="observer" v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(saveProcedure)">
          <b-form-group class="col-md-12" label="Service" label-for="selectprocedure" v-show="!service.id">
            <ValidationProvider name="Service" rules="required" v-slot="{ errors }">
              <b-form-select plain v-model="service.service_id" :options="procedureTypeOptions" id="selectprocedure" :class="(errors.length > 0 ? ' is-invalid' : '')">
                <template v-slot:first>
                  <b-form-select-option :value="null">Select Service</b-form-select-option>
                </template>
              </b-form-select>
              <div class="invalid-feedback">
                <span>{{ errors[0] }}</span>
              </div>
            </ValidationProvider>
          </b-form-group>
          <b-form-group class="col-md-12" label="amount" label-for="amount" v-show="!service.id">
            <b-form-input id="amount" v-model="service.amount" type="number" placeholder="Enter Amount"></b-form-input>
          </b-form-group>
          <b-form-group class="col-md-12" label="Remarks" label-for="remarks">
            <b-form-textarea v-model="service.remarks" id="remarks" rows="3"></b-form-textarea>
          </b-form-group>
          <b-button class="mt-3 float-right" variant="primary" type="submit">Save</b-button>
        </form>
      </validation-observer>
    </b-modal>
    <b-modal id="modal-add-payment" centered title="Add Payment" hide-footer cancel-title="Close">
      <validation-observer ref="observer" v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(savePayment)">
          <b-form-group class="col-md-12" label="Payment Type" label-for="selectpaymenttype">
            <ValidationProvider name="Payment Type" rules="required" v-slot="{ errors }">
              <b-form-select plain v-model="payment.payment_type_id" @change="selectedPaymentTypeTrigger" :options="paymentTypeOption" id="selectpaymenttype" :class="(errors.length > 0 ? ' is-invalid' : '')">
                <template v-slot:first>
                  <b-form-select-option :value="null">Select Payment Type</b-form-select-option>
                </template>
              </b-form-select>
              <div class="invalid-feedback">
                <span>{{ errors[0] }}</span>
              </div>
            </ValidationProvider>
          </b-form-group>
          <b-form-group v-if="isShowAddInfo" class="col-md-12" label="Account Name" label-for="account_name">
              <b-form-input id="account_name" v-model="payment.account_name" type="text" placeholder="Account Name"></b-form-input>
          </b-form-group>
          <b-form-group v-if="isShowAddInfo" class="col-md-12" label="Reference No." label-for="reference_number">
              <b-form-input id="reference_number" v-model="payment.reference_number" type="text" placeholder="Reference No."></b-form-input>
          </b-form-group>
          <b-form-group class="col-md-12" label="amount" label-for="paymentamount">
            <ValidationProvider name="Amount" rules="required" v-slot="{ errors }">
              <b-form-input id="paymentamount" v-model="payment.amount" type="number" step="0.01" placeholder="Enter Amount" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
              <div class="invalid-feedback">
                <span>{{ errors[0] }}</span>
              </div>
            </ValidationProvider>
          </b-form-group>
          <b-button class="mt-3 float-right" variant="primary" type="submit">Save</b-button>
        </form>
      </validation-observer>
    </b-modal>
    <b-modal id="modal-add-discount" centered title="Add Discount" hide-footer cancel-title="Close">
      <validation-observer ref="observer" v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(handleAddDiscount)">
          <div class="row mb-4">
            <div class="col-12">
              <b-form-checkbox v-model="isCustomDiscount" inline>Is Custom Discount?</b-form-checkbox>
              <!-- <b-button class="mt-3 float-right" variant="primary" type="button" @click="addNewDiscount()"><i class="fa fa-plus"></i> ADD NEW DISCOUNT</b-button> -->
            </div>
          </div>
          <div class="row" v-if="isCustomDiscount">
            <b-form-group class="col-md-12 required" label="Name:" label-for="name">
              <b-form-input v-model="discountForm.name" :class="errors?.name ? 'is-invalid' : ''" type="text" name="name" id="name" placeholder="Discount Name" required></b-form-input>
              <div class="invalid-feedback" v-for="(error, i) in errors?.name" :key="`name-error-${i}`"> {{ error }} </div>
            </b-form-group>
            <b-form-group class="col-md-12">
              <b-form-checkbox v-model="discountForm.is_fixed_amount">Is Fixed Amount?</b-form-checkbox>
              <div class="invalid-feedback" v-for="(error, i) in errors?.is_fixed_amount" :key="`is_fixed_amount-error-${i}`"> {{ error }} </div>
            </b-form-group>
            <b-form-group class="col-md-12" label="Discount Rate (%):" label-for="discount_rate" v-show="!discountForm.is_fixed_amount">
                <b-form-input v-model="discountForm.discount_rate" @keypress="isNumber($event)" :class="errors?.discount_rate ? 'is-invalid' : ''" type="text" name="discount_rate" id="discount_rate" placeholder="Discount Rate" :required="!discountForm.is_fixed_amount" autocomplete="off"></b-form-input>
                <div class="invalid-feedback" v-for="(error, i) in errors?.discount_rate" :key="`discount_rate-error-${i}`"> {{ error }} </div>
            </b-form-group>
            <b-form-group class="col-md-12" label="Discount Amount:" label-for="name" v-show="discountForm.is_fixed_amount">
                <b-form-input v-model="discountForm.discount_amount" @keypress="isNumber($event)" :class="errors?.discount_amount ? 'is-invalid' : ''" type="text" name="name" id="name" placeholder="Discount Amount" :required="discountForm.is_fixed_amount" autocomplete="off" ></b-form-input>
                <div class="invalid-feedback" v-for="(error, i) in errors?.discount_amount" :key="`discount_amount-error-${i}`"> {{ error }} </div>
            </b-form-group>
          </div>
          <div class="row" v-else>
            <b-form-group class="col-md-12" label="Discount" label-for="selectdiscount">
              <ValidationProvider name="Discount" rules="required" v-slot="{ errors }">
                <b-form-select plain v-model="newDiscountId" @change="selectedPaymentTypeTrigger" :options="discountOptions" id="selectdiscount" :class="(errors.length > 0 ? ' is-invalid' : '')">
                  <template v-slot:first>
                    <b-form-select-option :value="null">Select Discount</b-form-select-option>
                  </template>
                </b-form-select>
                <div class="invalid-feedback">
                  <span>{{ errors[0] }}</span>
                </div>
              </ValidationProvider>
            </b-form-group>
            <b-form-group class="col-md-12" label="ID Number" label-for="id_number">
                <b-form-input id="id_number" v-model="newDiscountIdNumber" type="text" placeholder="ID Number"></b-form-input>
            </b-form-group>
          </div>
          <div class="row">
            <div class="col-12">
              <b-button class="mt-3 float-right" variant="primary" type="submit" :disabled='isLoading'>
                Save
                <b-spinner v-show="isLoading" small></b-spinner>
              </b-button>
            </div>
          </div>
        </form>
      </validation-observer>
    </b-modal>
    <!-- <b-modal id="modal-add-new-discount" centered title="ADD NEW DISCOUNT" hide-footer cancel-title="Close">
        <form @submit.prevent="createNewDiscount()">
          <b-form-group class="col-md-12 required" label="Name:" label-for="name">
              <b-form-input v-model="discountForm.name" :class="errors?.name ? 'is-invalid' : ''" type="text" name="name" id="name" placeholder="Discount Name" required></b-form-input>
              <div class="invalid-feedback" v-for="(error, i) in errors?.name" :key="`name-error-${i}`"> {{ error }} </div>
          </b-form-group>
          <b-form-group class="col-md-12">
            <b-form-checkbox v-model="discountForm.is_fixed_amount">Is Fixed Amount?</b-form-checkbox>
            <div class="invalid-feedback" v-for="(error, i) in errors?.is_fixed_amount" :key="`is_fixed_amount-error-${i}`"> {{ error }} </div>
          </b-form-group>
          <b-form-group class="col-md-12" label="Discount Rate:" label-for="discount_rate" v-show="!discountForm.is_fixed_amount">
              <b-form-input v-model="discountForm.discount_rate" @keypress="isNumber($event)" :class="errors?.discount_rate ? 'is-invalid' : ''" type="text" name="discount_rate" id="discount_rate" placeholder="Discount Rate"></b-form-input>
              <div class="invalid-feedback" v-for="(error, i) in errors?.discount_rate" :key="`discount_rate-error-${i}`"> {{ error }} </div>
          </b-form-group>
          <b-form-group class="col-md-12" label="Discount Amount:" label-for="name" v-show="discountForm.is_fixed_amount">
              <b-form-input v-model="discountForm.discount_amount" @keypress="isNumber($event)" :class="errors?.discount_amount ? 'is-invalid' : ''" type="text" name="name" id="name" placeholder="Discount Amount"></b-form-input>
              <div class="invalid-feedback" v-for="(error, i) in errors?.discount_amount" :key="`discount_amount-error-${i}`"> {{ error }} </div>
          </b-form-group>
          <b-button class="mt-3 mx-2 float-right" variant="primary" type="submit" :disabled="isLoading">Save</b-button>
          <b-button class="mt-3 mx-2 float-right" variant="light" @click="cancelAction" type="button">Cancel</b-button>
        </form>
    </b-modal> -->
    <b-modal id="modal-update-service-commission" centered title="Edit Commission" hide-footer cancel-title="Close">
      <validation-observer ref="observer" v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(handleUpdateCommissionService())">
          <b-form-group class="col-md-12" label="Commission Type" label-for="commission_type">
            <b-form-radio inline v-model="commissionUpdate.commission_type" name="commission_type" v-for="(d, i) in commissionTypes" :key="i" :value="d">{{ d }}</b-form-radio>
          </b-form-group>
          <b-form-group class="col-md-12" label="Amount" v-if="commissionUpdate.commission_type === 'Fixed'" label-for="commission_amt">
            <ValidationProvider name="Amount" rules="required" v-slot="{ errors }">
              <b-form-input id="commission_amt" v-model="commissionUpdate.commission_amt" type="number" placeholder="Enter Amount" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
              <div class="invalid-feedback">
                <span>{{ errors[0] }}</span>
              </div>
            </ValidationProvider>
          </b-form-group>
          <b-form-group class="col-md-12" label="Percentage" v-if="commissionUpdate.commission_type === 'Percentage'" label-for="commission_percentage">
            <ValidationProvider name="Percentage" rules="required" v-slot="{ errors }">
              <b-form-input id="commission_percentage" v-model="commissionUpdate.commission_percentage" type="number" maxlength="3" max-value="100" placeholder="Enter Percentage" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
              <div class="invalid-feedback">
                <span>{{ errors[0] }}</span>
              </div>
            </ValidationProvider>
          </b-form-group>
          <b-form-group class="col-md-12" label="Remarks" label-for="commission_remarks">
            <ValidationProvider name="Remarks" rules="required" v-slot="{ errors }">
              <b-form-textarea id="commission_remarks" v-model="commissionUpdate.commission_remarks" rows="3" ></b-form-textarea>
              <div class="invalid-feedback">
                <span>{{ errors[0] }}</span>
              </div>
            </ValidationProvider>
          </b-form-group>
          <b-button class="mt-3 float-right" variant="primary" type="submit">Save</b-button>
        </form>
      </validation-observer>
    </b-modal>
    <b-modal id="modal-additional-commission" centered title="Additional Commission" hide-footer cancel-title="Close">
      <validation-observer ref="observer" v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(handleSaveAdditionalCommission)">
          <b-form-group class="col-md-12" label="Amount" label-for="additional_commission">
            <ValidationProvider name="Amount" rules="required" v-slot="{ errors }">
              <b-form-input id="additional_commission" v-model="detail.additional_commission" type="number" step="0.01" placeholder="Enter Amount" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
              <div class="invalid-feedback">
                <span>{{ errors[0] }}</span>
              </div>
            </ValidationProvider>
          </b-form-group>
          <b-form-group class="col-md-12" label="Remarks" label-for="additional_commission_remarks">
            <ValidationProvider name="Remarks" rules="required" v-slot="{ errors }">
              <b-form-textarea id="additional_commission_remarks" v-model="detail.additional_commission_remarks" rows="3" ></b-form-textarea>
              <div class="invalid-feedback">
                <span>{{ errors[0] }}</span>
              </div>
            </ValidationProvider>
          </b-form-group>
          <b-button class="mt-3 float-right" variant="primary" type="submit">Save</b-button>
        </form>
      </validation-observer>
    </b-modal>
    <b-modal id="modal-additional-payable" centered title="Additional Payable" hide-footer cancel-title="Close">
      <validation-observer ref="observer" v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(handleSaveAdditionalPayable)">
          <b-form-group class="col-md-6" label="Type" label-for="selecttype">
            <b-form-select v-model="additionalPayableType"  plain :options="payableType" id="selecttype">
              <template v-slot:first>
                <b-form-select-option :value="null">Select Type</b-form-select-option>
              </template>
            </b-form-select>
          </b-form-group>
          <b-form-group class="col-md-12" label="Amount" label-for="payableAmount">
            <ValidationProvider name="Amount" rules="required" v-slot="{ errors }">
              <b-form-input id="payableAmount" v-model="additionalPayableAmount" type="number" step="0.01" placeholder="Enter Amount" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
              <div class="invalid-feedback">
                <span>{{ errors[0] }}</span>
              </div>
            </ValidationProvider>
          </b-form-group>
          <b-form-group class="col-md-12" label="Description" label-for="payableDescription">
            <ValidationProvider name="Description" rules="required" v-slot="{ errors }">
              <b-form-textarea id="payableDescription" v-model="additionalPayableDescription" rows="3" ></b-form-textarea>
              <div class="invalid-feedback">
                <span>{{ errors[0] }}</span>
              </div>
            </ValidationProvider>
          </b-form-group>
          <b-button class="mt-3 float-right" variant="primary" type="submit">Save</b-button>
        </form>
      </validation-observer>
    </b-modal>
    <PrescriptionModal :form_action="form_action" :defaultPrescriptionForm="prescriptionForm" :ActivityId="$route.params.id" @triggerPrescription="triggerPrescription($event)"/>
    <AttachmentModal :form_action="form_action" :defaultAttachmentForm="attachmentForm" :ActivityId="$route.params.id" @triggerAttachment="triggerAttachment($event)"/>
    <PrintPrescriptionModal :form_action="form_action" title="Prescription" :userActiveBranch="userActiveBranch" :patientInfo="patientInfo" :currentDate="currentDate" :patientAge="patientAge" :prescriptionForm="prescriptionForm"/>
    <RecommendationModal :form_action="form_action" @reloadRecommendationList="reloadRecommendationList($event)" :activityId="$route.params.id" :patientId="(detail?.patient_id ?? '').toString()" :selectedRecommendation="selectedRecommendation"/>
    <CoolLightBox
          :items="imageItems"
          :index="index"
          @close="index = null" />
  </b-container>
</template>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<script>
import IqCard from '../../components/xray/cards/iq-card'
import { xray } from '../../config/pluginInit'
import activity from '../../services/activity'
import services from '../../services/services'
import discounts from '../../services/discount'
import activityServices from '../../services/activity-service'
import additionalPayable from '../../services/additional-payable'
import paymentTypes from '../../services/payment-type'
import doctor from '../../services/doctor'
import PrescriptionModal from '../GlobalComponents/Modals/PrescriptionModal.vue'
import AttachmentModal from '../GlobalComponents/Modals/AttachmentModal.vue'
import PrintPrescriptionModal from '../GlobalComponents/Modals/PrintPrescriptionModal.vue'
import prescriptionService from '../../services/prescription'
import attachmentService from '../../services/attachment'
import patient from '../../services/patient'
import RecommendationModal from './RecommendationModal.vue'
import activityRecomendation from '../../services/activity-recomendation'
import Multiselect from 'vue-multiselect'
import { mapGetters } from 'vuex'
import _ from 'lodash'
import CoolLightBox from 'vue-cool-lightbox'
import 'vue-cool-lightbox/dist/vue-cool-lightbox.min.css'
export default {
  name: 'ViewActivity',
  components: { IqCard, CoolLightBox, PrescriptionModal, AttachmentModal, PrintPrescriptionModal, RecommendationModal, Multiselect },
  mounted () {
    xray.index()
    this.fetchActitivyById()
    this.fetchProcedureTypes()
    this.fetchDiscounts()
    this.fetchPaymentTypes()
    // this.fetchDoctorList()
    this.fetchActivityPayments()
    this.fetchActivityDiscounts()
    this.subscribeToChannelAttachment()
    this.subscribeToChannelServices()
    this.subscribeToChannelPrescriptions()
    this.fetchActivityAdditionalPayables()
  },
  watch: {
    'discountForm.is_fixed_amount': _.debounce(function (data) {
       if (data) {
        this.discountForm.discount_rate = ''
       } else {
        this.discountForm.discount_amount = ''
       }
    }, 300),
    'detail.patient_id': _.debounce(function (data) {
      if (data && this.detail.is_dentist_required) {
        this.getPatientRecomFromPrevAct()
      }
    }),
    'commissionUpdate.commission_type': _.debounce(function () {
      this.commissionUpdate.commission_amt = ''
      this.commissionUpdate.commission_percentage = ''
    }),
    detail: _.debounce(function (data) {
      this.prescriptionForm.patient_id = data?.patient_id
      this.attachmentForm.patient_id = data?.patient_id
      this.fetchPatientById(data?.patient_id)
      this.changeFieldView()
      this.getAllPatientPrescriptions()
      this.getAllPatientAttachments()
    }),
    userDetails: _.debounce(function (data) {
      this.getAllPatientPrescriptions()
      this.getAllPatientAttachments()
        this.recommendationFields = data?.role === 'DA' ? [
            { label: 'Treatment', key: 'treatment', headerClass: 'text-left', sortable: true },
            { label: 'Next Visit Remmendation', key: 'next_visit_recom', headerClass: 'text-left', sortable: true },
            // { label: 'D.A On Duty', key: 'dental_assistant', headerClass: 'text-left', sortable: true },
            { label: 'Actions', key: 'actions', sortable: false }
        ] : [
            { label: 'Treatment', key: 'treatment', headerClass: 'text-left', sortable: true },
            { label: 'Next Visit Remmendation', key: 'next_visit_recom', headerClass: 'text-left', sortable: true }
            // { label: 'D.A On Duty', key: 'dental_assistant', headerClass: 'text-left', sortable: true },
            // { label: 'Actions', key: 'actions', sortable: false }
        ]
    }),
    prescriptionCurrentPage: _.debounce(function (data) {
      this.getAllPatientPrescriptions()
    }),
    attachmentCurrentPage: _.debounce(function (data) {
      this.getAllPatientAttachments()
    }),
    patientInfo: _.debounce(function (data) {
        const today = new Date()
        const birthDate = new Date(data?.birth_date)
        let age = today.getFullYear() - birthDate.getFullYear()
        let m = today.getMonth() - birthDate.getMonth()
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--
        }
        this.patientAge = Number.isNaN(age) ? '0' : age.toString()
    }),
    'userActiveBranch.id': _.debounce(function () {
      this.fetchActitivyById()
      this.fetchProcedureTypes()
      this.fetchDiscounts()
      // this.fetchDoctorList()
    }),
    dental_assistant: _.debounce(function (data) {
      this.detail.dental_assistant = data
    })
  },
  created () {
    this.subscribeToChannelServices()
    this.subscribeToChannelAttachment()
    this.subscribeToChannelPrescriptions()
  },
  data () {
    return {
      isCustomDiscount: false,
      errors: {},
      discountForm: {
       id: '',
       name: '',
       branch_id: '',
       is_fixed_amount: false,
       discount_rate: '',
       discount_amount: ''
      },
      commissionTypes: ['Fixed', 'Percentage'],
      small: true,
      totalProcedure: 1,
      procedureTypeOptions: [],
      discountOptions: [],
      services: [],
      newDiscountId: 0,
      newDiscountIdNumber: null,
      service: {
        id: null,
        service_id: null,
        amount: 0,
        remarks: ''
      },
      recommendationFields: this.userDetails?.role === 'DA' ? [
          { label: 'Treatment', key: 'treatment', headerClass: 'text-left', sortable: true },
          { label: 'Next Visit Remmendation', key: 'next_visit_recom', headerClass: 'text-left', sortable: true },
          // { label: 'D.A On Duty', key: 'dental_assistant', headerClass: 'text-left', sortable: true },
          { label: 'Actions', key: 'actions', sortable: false }
      ] : [
          { label: 'Treatment', key: 'treatment', headerClass: 'text-left', sortable: true },
          { label: 'Next Visit Remmendation', key: 'next_visit_recom', headerClass: 'text-left', sortable: true }
          // { label: 'D.A On Duty', key: 'dental_assistant', headerClass: 'text-left', sortable: true },
          // { label: 'Actions', key: 'actions', sortable: false }
      ],
      attachmentFields: [
          { label: 'Attachment Type', key: 'attachment_type', headerClass: 'text-left', sortable: true },
          { label: 'Title', key: 'title', headerClass: 'text-left', sortable: true },
          { label: 'Description', key: 'description', headerClass: 'text-left', sortable: true },
          { label: 'Actions', key: 'actions', sortable: false }
      ],
      prescriptionFields: [
        { label: 'Prescription ID', key: 'display_id', headerClass: 'text-left', sortable: true },
        { label: 'Date', key: 'created_dt', headerClass: 'text-left', sortable: true },
        { label: 'Description', key: 'description', headerClass: 'text-left', sortable: true },
        { label: 'Actions', key: 'actions', sortable: false }
      ],
      additionalPayableFields: [
        { label: 'Type', key: 'type', headerClass: 'text-left', sortable: true },
        { label: 'Amount', key: 'amount', headerClass: 'text-left', sortable: true },
        { label: 'Description', key: 'description', headerClass: 'text-left', sortable: true },
        { label: 'Actions', key: 'actions', sortable: false }
      ],
      fields: [
        { label: 'Service', key: 'service_name', headerClass: 'text-left' },
        { label: 'Amount', key: 'amount', headerClass: 'text-right' },
        { label: 'Commission', key: 'commission_amount', headerClass: 'text-right' },
        { label: 'Remarks', key: 'remark', headerClass: 'text-left' },
        { label: 'Added By', key: 'added_by', headerClass: 'text-left' }
      ],
      doctors: [],
      payableType: [
        { value: 'balance', text: 'Balance' },
        { value: 'others', text: 'Others' }
      ],
      additionalPayableAmount: null,
      additionalPayableType: null,
      additionalPayableDescription: null,
      payable: {
        activity_id: '',
        amount: null,
        type: null,
        description: null
      },
      procedureItems: [],
      paymentTypes: [],
      discounts: [],
      paymentTypeOption: [],
      payment: {
        payment_type_id: null,
        account_name: null,
        reference_number: null,
        amount: 0
      },
      discount: {
        discount_id: null,
        discount_amount: 0,
        id_number: null
      },
      isShowAddInfo: false,
      tenderPayments: [],
      tenderDiscount: [],
      selectedDoctor: {},
      dental_assistant: '',
      doctor_id: null,
      detail: {
        dental_assistant: '',
        id: '',
        patient: {
          first_name: '',
          last_name: '',
          birth_date: '',
          weight: '',
          height: '',
          occupation: '',
          address_line2: '',
          email_address: ''
        },
        patient_id: '',
        doctor_id: '',
        dental_assistant_id: '',
        doctor_name: '',
        services: [],
        remarks: '',
        status: '',
        is_paid: 'N',
        is_settle_with_balance: 'N',
        balance: 0
      },
      patientChart: {
        series: [{
          name: 'Servings',
          data: [44, 55, 41, 67, 22, 43, 21, 33, 45, 31]
        }],
        annotations: {
          points: [{
            x: 'Bananas',
            seriesIndex: 0,
            label: {
              borderColor: '#775DD0',
              offsetY: 0,
              style: {
                color: '#fff',
                background: '#775DD0'
              },
              text: 'Bananas are good'
            }
          }]
        },
        chart: {
          height: 350,
          type: 'bar'
        },
        colors: ['#089bab'],
        plotOptions: {
          bar: {
            columnWidth: '50%',
            endingShape: 'rounded'
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          width: 2
        },

        grid: {
          row: {
            colors: ['#fff', '#f2f2f2']
          }
        },
        xaxis: {
          labels: {
            rotate: -45
          },
          categories: ['A', 'B', 'C', 'D', 'E', 'F',
            'G', 'H', 'I', 'J'
          ],
          tickPlacement: 'on'
        },
        yaxis: {
          title: {
            text: 'Servings'
          }
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'light',
            type: 'horizontal',
            shadeIntensity: 0.25,
            gradientToColors: undefined,
            inverseColors: true,
            opacityFrom: 0.85,
            opacityTo: 0.85,
            stops: [50, 0, 100]
          }
        }
      },
      form_action: 'Add',
      recommendationCurrentPage: 1,
      recommendations: {},
      prescriptionCurrentPage: 1,
      prescriptions: {},
      prescriptionForm: {
        id: '',
        activity_id: '',
        patient_id: '',
        doctor_id: '',
        doctor: '',
        description: '',
        prescriptionList: [
          { id: '', qty: '', unit: '', name: '', desc: '' }
        ]
      },
      attachmentCurrentPage: 1,
      imageItems: [],
      index: null,
      attachments: {},
      attachmentForm: {
        id: '',
        activity_id: '',
        isUploadNewFile: false,
        patient_id: this.detail?.patient_id,
        attachment_type: null,
        title: '',
        description: '',
        file: '',
        file_path: ''
      },
      patientAge: '0',
      patientInfo: {},
      additionalCommissionInfo: {
        amount: 0,
        remarks: ''
      },
      channelServices: null,
      channelAttachments: null,
      channelPrescriptions: null,
      additionalPayables: [],
      selectedServiceId: '',
      commissionUpdate: {
        commission_type: 'Fixed',
        commission_amt: '',
        commission_percentage: '',
        commission_remarks: ''
      },
      selectedRecommendation: {},
      recomFromPrevAct: [],
      isLoading: false
    }
  },
  computed: {
    ...mapGetters({
      userDetails: 'Auth/userDetails',
      userActiveBranch: 'Auth/userActiveBranch'
    }),
    currentDate () {
      return new Date().toLocaleDateString()
    },
    age () {
      const today = new Date()
      const birthDate = new Date(this.detail.patient.birth_date)
      let age = today.getFullYear() - birthDate.getFullYear()
      let m = today.getMonth() - birthDate.getMonth()
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      return age
    },
    servicesList () {
      var dataList = this.detail.services.map(d => {
        if (d?.is_delete === 'Y') {
          return { ...d, _rowVariant: 'warning' }
        } else if (d?.is_voided === 'Y') {
          return { ...d, _rowVariant: 'danger' }
        } else {
          return d
        }
      })
      return dataList
    },
    additionalPayableList () {
      return this.additionalPayables.map(d => {
        if (d?.is_delete === 'Y') {
          return { ...d, _rowVariant: 'warning' }
        } else {
          return d
        }
      })
    },
    totalAmount () {
      const sum = this.detail.services.reduce((accumulator, object) => {
          return accumulator + (object?.is_delete === 'N' && object?.is_voided === 'N' ? parseFloat(object.amount) : 0)
      }, 0)
      const sumAddPayable = this.additionalPayables.reduce((accumulator, object) => {
          return accumulator + (object?.is_delete === 'N' ? parseFloat(object.amount) : 0)
      }, 0)
      return sum + sumAddPayable
    },
    amountToBePaid () {
      const sum = this.detail.services.reduce((accumulator, object) => {
          return accumulator + (object?.is_delete === 'N' && object?.is_voided === 'N' ? parseFloat(object.amount) : 0)
      }, 0)

      const discountAmount = this.tenderDiscount.reduce((accumulator, object) => {
          return accumulator + parseFloat(object.discountedAmount)
      }, 0)

      const sumAddPayable = this.additionalPayables.reduce((accumulator, object) => {
          return accumulator + (object?.is_delete === 'N' ? parseFloat(object.amount) : 0)
      }, 0)

      return (sum + sumAddPayable) - discountAmount
    },
    totalCommission () {
      const sum = this.detail.services.reduce((accumulator, object) => {
          return accumulator + (object?.is_delete === 'N' && object?.is_voided === 'N' ? parseFloat(object.commission_amount) : 0)
      }, 0)
      return sum
    },
    totalCommissionWithAdditional () {
      const sum = this.detail.services.reduce((accumulator, object) => {
          return accumulator + (object?.is_delete === 'N' && object?.is_voided === 'N' ? parseFloat(object.commission_amount) : 0)
      }, 0)

      const total = sum + parseFloat(this.additionalCommissionInfo.amount)
      return total
    },
    showSelectionOfDentist () {
      if (this.detail.status === 'pending') {
        return true
      }
      return false
    },
    tenderedAmount () {
      const sum = this.tenderPayments.reduce((accumulator, object) => {
        return accumulator + parseFloat(object.amount)
      }, 0)
      return sum
    },
    balance () {
      const balance = this.amountToBePaid - this.tenderedAmount
      return balance > 0 ? balance : 0
    },
    returnAmount () {
      const returnAmount = this.tenderedAmount - this.amountToBePaid
      return returnAmount > 0 ? returnAmount : 0
    }
  },
  methods: {
    onSelect (option) {
      this.doctor_id = option?.value
      this.detail.doctor_id = option?.value
    },
    // addNewDiscount () {
    //   this.clearNewDiscountForm()
    //   this.$bvModal.show('modal-add-new-discount')
    // },
    clearNewDiscountForm () {
        this.discountForm.id = ''
        this.discountForm.name = ''
        this.discountForm.is_fixed_amount = false
        this.discountForm.discount_rate = ''
        this.discountForm.discount_amount = ''
    },
    // createNewDiscount () {
    //   this.isLoading = true
    //   this.discountForm.branch_id = this.userActiveBranch?.branch_id
    //   discounts.createDiscount(this.discountForm).then(({ data }) => {
    //       if (data?.errors) {
    //         this.errors = data?.errors
    //       }
    //       if (data.success) {
    //         this.clearNewDiscountForm()
    //         this.fetchDiscounts()
    //         this.$bvModal.hide('modal-add-new-discount')
    //       }
    //       this.$swal(data?.message)
    //       this.isLoading = false
    //   }).catch(err => {
    //     this.isLoading = false
    //     console.log(err)
    //   })
    // },
    hideRecommendation (item) {
      activityRecomendation.hidePatientRecom({ id: item?.id })
      .then(({ data, status }) => {
        if (status === 200 && data?.success) {
          this.getPatientRecomFromPrevAct()
        }
      })
      .catch(error => { console.log(error) })
    },
    getPatientRecomFromPrevAct () {
      var payload = {
          patient_id: this.detail?.patient_id,
          activity_id: this.$route.params.id
        }
        activityRecomendation.getPatientRecommendationFromPrevAct(payload)
        .then(({ data, status }) => {
          if (status === 200 && data?.success) {
            this.recomFromPrevAct = data?.data
          }
        })
    },
    reloadRecommendationList (e) {
      if (e && this.detail.is_dentist_required) {
        var payload = {
          patient_id: this.detail?.patient_id,
          activity_id: this.$route.params.id,
          page: this.recommendationCurrentPage
        }
        activityRecomendation.getAllRecommendationsByActivity(payload).then(({ data, status }) => {
          if (data.success) {
            this.recommendations = data?.data
          }
        }).catch(err => console.log(err))
      }
    },
    clearUpdateCommissionForm () {
      this.selectedServiceId = ''
      this.commissionUpdate.commission_type = 'Fixed'
      this.commissionUpdate.commission_amt = ''
      this.commissionUpdate.commission_percentage = ''
      this.commissionUpdate.commission_remarks = ''
    },
    handleUpdateCommissionService () {
      activityServices.updateActivityServiceCommission(this.commissionUpdate, this.selectedServiceId)
      .then(({ data }) => {
        if (data?.success) {
          this.fetchActitivyById()
          this.clearUpdateCommissionForm()
          this.$bvModal.hide('modal-update-service-commission')
        }
        this.$swal(data?.message)
      })
    },
    actionEditCommissionAmtService (item) {
      this.selectedServiceId = item?.id
      this.$bvModal.show('modal-update-service-commission')
    },
    clearServicesForm () {
        this.service.id = null
        this.service.service_id = null
        this.service.amount = 0
        this.service.remarks = ''
    },
    editRemarks (item) {
      this.service.id = item?.id
        this.service.service_id = item?.service_id
        this.service.amount = item?.amount
        this.service.remarks = item?.remarks
      this.$bvModal.show('modal-add-procedure')
    },
    deleteAdditionalCom () {
      this.handleSaveAdditionalCommission('delete')
    },
    fetchPatientById (id) {
      if (this.userActiveBranch?.id) {
        patient.getPatientById(id, this.userActiveBranch?.id).then(response => {
          if (response.data.success) {
            this.patientInfo = response.data.data
          }
        }).catch(err => console.log(err))
      }
    },
    actionRecommendationItem (item, act) {
      if ((['Add', 'Edit']).includes(act)) {
        this.selectedRecommendation = item
        this.form_action = act
      } else {
        this.$swal.fire({
            title: 'Are you sure you want to remove this record?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
          if (result.isConfirmed) {
            activityRecomendation.deleteActivityRecommendation(item?.id)
            .then(response => {
              if (response.data.success) {
               this.reloadRecommendationList(true)
              }
              this.$swal(response?.data?.message)
            })
          }
        })
      }
    },
    clearAttachmentForm () {
      this.attachmentForm.id = ''
            this.attachmentForm.isUploadNewFile = false
            this.attachmentForm.attachment_type = null
            this.attachmentForm.title = ''
            this.attachmentForm.description = ''
            this.attachmentForm.file = ''
    },
    actionAttachmentItem (item, act) {
      this.form_action = act
      if (act === 'Add') {
        this.clearAttachmentForm()
      } else {
        this.index = null
        var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i
        if (allowedExtensions.exec(item?.filename) && act === 'View') {
          this.imageItems.forEach((d, i) => {
            if (d === this.getImageUri(item?.filename)) {
              this.index = i
            }
          })
        } else {
          this.attachmentForm.id = item?.id
          this.attachmentForm.isUploadNewFile = false
          this.attachmentForm.attachment_type = item?.attachment_type
          this.attachmentForm.title = item?.title
          this.attachmentForm.description = item?.description
          this.attachmentForm.file_path = this.getImageUri(item?.filename)
          this.$bvModal.show('modal-attachment')
        }
      }
    },
    actionPrescriptionItem (item, act) {
      this.form_action = act
      if (act === 'Add') {
        this.prescriptionForm = {
          id: '',
          patient_id: this.detail.patient_id,
          doctor_id: '',
          doctor: '',
          description: '',
          prescriptionList: [
            { id: '', qty: '', unit: '', name: '', desc: '' }
          ]
        }
      } else {
        this.prescriptionForm.id = item?.id
        this.prescriptionForm.doctor_id = item?.doctor_id
        this.prescriptionForm.doctor = item?.doctor
        this.prescriptionForm.description = item?.description
        var items = item?.prescription_items?.map(d => {
          return { id: d?.id, qty: d?.quantity, unit: d?.uni_of_measurement, name: d?.name, desc: d?.description }
        })
        this.prescriptionForm.prescriptionList = items.length ? items : [
              { id: '', qty: '', unit: '', name: '', desc: '' }
          ]
      }
    },
    subscribeToChannelPrescriptions () {
      const id = this.$route.params.id
      this.channelPrescriptions = this.$pusher.subscribe('activity-prescription-' + id)
      this.channelPrescriptions.bind('prescription-event', (data) => {
        this.getAllPatientPrescriptions()
      })
    },
    getAllPatientPrescriptions () {
      prescriptionService.getAllPrescriptionsByPaginate({ patient_id: this.detail.patient_id, activity_id: this.$route.params.id }, this.prescriptionCurrentPage).then(({ data }) => {
        if (data.success) {
          this.prescriptions = data?.data
        }
      }).catch(err => console.log(err))
    },
    triggerPrescription (e) {
      if (e) {
        this.getAllPatientPrescriptions()
      }
    },
    subscribeToChannelAttachment () {
      const id = this.$route.params.id
      this.channelAttachments = this.$pusher.subscribe('activity-attachment-' + id)
      this.channelAttachments.bind('attachment-event', (data) => {
        this.getAllPatientAttachments()
      })
    },
    getAllPatientAttachments () {
      this.imageItems = []
      attachmentService.getAllAttachmentsByPaginate({ patient_id: this.patientId, activity_id: this.$route.params.id }, this.attachmentCurrentPage).then(({ data }) => {
        if (data.success) {
          this.attachments = data?.data
          this.imageItems = this.attachments?.data?.map(d => {
                  return this.getImageUri(d?.filename)
                })
        }
      }).catch(err => console.log(err))
    },
    getImageUri (uri) {
        if (uri) {
            var cnt = uri.split('/')
            if (cnt.length > 3) {
            return uri
            } else {
            return process.env.VUE_APP_API_BASE_URL + uri
            }
        }
    },
    triggerAttachment (e) {
      if (e) {
        this.getAllPatientAttachments()
      }
    },
    changeFieldView () {
      this.fields = this.userDetails.role === 'DA' ? [
        { label: 'Service', key: 'service_name', headerClass: 'text-left' },
        { label: 'Amount', key: 'amount', headerClass: 'text-right' },
        { label: 'Added By', key: 'added_by', headerClass: 'text-left' },
        { label: 'Remarks', key: 'remarks', headerClass: 'text-left' },
        { label: 'Action', key: 'actions', headerClass: 'text-left' }
      ] : [
        { label: 'Service', key: 'service_name', headerClass: 'text-left' },
        { label: 'Amount', key: 'amount', headerClass: 'text-right' },
        { label: 'Commission', key: 'commission_amount', headerClass: 'text-right' },
        { label: 'Added By', key: 'added_by', headerClass: 'text-left' },
        { label: 'Remarks', key: 'remarks', headerClass: 'text-left' },
        { label: 'Action', key: 'actions', headerClass: 'text-left' }
      ]
    },
    actionDelServiceAvail (item) {
      this.$swal.fire({
          title: 'Are you sure you want to delete this record?',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'No'
      }).then((result) => {
        if (result.isConfirmed) {
          activityServices.deleteActivityService(item?.id).then(response => {
              if (response.data.success) {
               this.fetchActitivyById()
              }
          })
        }
      })
    },
    actionVoidServiceAvail (item) {
      this.$swal.fire({
          title: 'Are you sure you want to void this service?',
          input: 'text',
          inputLabel: 'Please enter your remarks:',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          showLoaderOnConfirm: true,
          inputValidator: (value) => {
            if (!value) {
              return 'You need to write something!'
            }
          }
      }).then((result) => {
        if (result.isConfirmed) {
          const data = {
            voided_remarks: result.value
          }
          activityServices.voidActivityService(data, item?.id).then(response => {
              if (response.data.success) {
               item.is_voided = 'Y'
               item.voided_remarks = result.value
              }
          })
        }
      })
    },
    actionCancelAdditionalPayable (item) {
      this.$swal.fire({
          title: 'Are you sure you want to delete this record?',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'No'
      }).then((result) => {
        if (result.isConfirmed) {
          additionalPayable.deleteAdditionalPayable(item?.id).then(response => {
              if (response.data.success) {
               this.fetchActivityAdditionalPayables()
              }
          })
        }
      })
    },
    selectedPaymentTypeTrigger () {
      const paymentType = this.paymentTypes.filter(pt => pt.id === this.payment.payment_type_id)[0]
      this.isShowAddInfo = paymentType?.need_reference_details === 'Y'
    },
    fetchActitivyById () {
      const id = this.$route.params.id
      if (this.userActiveBranch?.id) {
        activity.getActivityById(id, this.userActiveBranch?.id).then(response => {
          if (response?.data?.success) {
            this.detail = response.data.data
            this.additionalCommissionInfo.amount = this.detail.additional_commission
            this.additionalCommissionInfo.remarks = this.detail.additional_commission_remarks
            this.reloadRecommendationList(true)
          }
        }).catch((error) => {
          if (error.response) {
            console.log(error.response.data)
            console.log(error.response.status)
            if (error.response.status === 404) {
              this.$router.push('/pages/error/404')
            }
            console.log(error.response.headers)
          } else if (error.request) {
            console.log(error.request)
          } else {
            console.log('Error', error.message)
          }
          console.log('error.config', error.config)
        })
      }
    },
    fetchActivityAdditionalPayables () {
      const id = this.$route.params.id
      additionalPayable.getAdditionalPayablesByActivity(id).then(response => {
        if (response.data.success) {
          this.additionalPayables = response.data.data
        }
      }).catch(err => console.log(err))
    },
    subscribeToChannelServices () {
      const id = this.$route.params.id
      this.channelServices = this.$pusher.subscribe('activity-service-' + id)
      this.channelServices.bind('activity-service-event', (data) => {
        // this.fetchAllActivityServices()
        this.fetchActitivyById()
      })
    },
    fetchProcedureTypes () {
      this.procedureTypeOptions = []
      if (this.userActiveBranch?.id) {
        services.getAllServices(this.userActiveBranch?.id).then(response => {
          if (response.data.success) {
            const respData = response.data.data
            this.services = respData
            respData.forEach(dta => {
              this.procedureTypeOptions.push({ value: dta.id, text: dta.name })
            })
          }
        }).catch(err => console.log(err))
      }
    },
    fetchAllActivityServices () {
      const id = this.$route.params.id
      activityServices.getAllServicesByActivity(id).then(response => {
        if (response.data.success) {
          const respData = response.data.data
          this.detail.services = []
          this.detail.services = respData
        }
      }).catch(err => console.log(err))
    },
    fetchDiscounts () {
      this.discountOptions = []
      this.discounts = []
      if (this.userActiveBranch?.id) {
        discounts.getAllBranchDiscounts(this.userActiveBranch?.id).then(response => {
          if (response.data.success) {
            const respData = response.data.data
            this.discounts = respData
            respData.forEach(dta => {
              this.discountOptions.push({ value: dta.id, text: dta.name })
            })
          }
        }).catch(err => console.log(err))
      }
    },
    deletePayment (index) {
      this.tenderPayments.splice(index, 1)
    },
    fetchPaymentTypes () {
      this.paymentTypes = []
      paymentTypes.getAllPaymentTypes().then(({ data }) => {
        if (data.success) {
          const respData = data.data
          this.paymentTypes = respData
          respData.forEach(dta => {
            this.paymentTypeOption.push({ value: dta.id, text: dta.name })
          })
        }
      }).catch(err => console.log(err))
    },
    fetchActivityPayments () {
      this.tenderPayments = []
      const id = this.$route.params.id
      activity.getActivityPaymentsByActivityId(id).then(response => {
        if (response.data.success) {
          const respData = response.data.data
          respData.forEach(dta => {
            this.tenderPayments.push({ id: dta.id, type: dta.name, amount: dta.amount })
          })
        }
      }).catch(err => console.log(err))
      // this.tenderPayments.push({ id: this.payment.payment_type_id, type: paymentType.name, amount: this.payment.amount })
    },
    fetchActivityDiscounts () {
      this.tenderDiscount = []
      const id = this.$route.params.id
      activity.getActivityDiscountsByActivityId(id).then(response => {
        if (response.data.success) {
          const respData = response.data.data
          respData.forEach(dta => {
            let discountName = dta.name
            if (dta.is_fixed_amount === 'Y') {
              discountName += ' ₱ ' + dta.discounted_amount + ''
            } else {
              discountName += ' ' + dta.discount_rate + '%'
            }
            this.tenderDiscount.push({ id: dta.id, name: discountName, discountedAmount: parseFloat(dta.discounted_amount) })
          })
        }
      }).catch(err => console.log(err))
      // this.tenderPayments.push({ id: this.payment.payment_type_id, type: paymentType.name, amount: this.payment.amount })
    },
    fetchDoctorList (query = '') {
      this.doctors = []
      if (this.userActiveBranch?.branch_id && query !== '') {
        this.isLoading = true
        doctor.getAllDocsByBranch(this.userActiveBranch?.branch_id, query).then(response => {
          if (response.data.success) {
            const doctors = response.data.data
            this.doctors = []
            doctors.forEach(doctor => {
              this.doctors.push({ value: doctor.id, text: doctor.first_name + ' ' + doctor.last_name })
            })
          }
          this.isLoading = false
        }).catch(err => {
          console.log(err)
          this.isLoading = false
        })
      }
    },
    getProcedureName (id) {
      const procedureType = this.services.filter(p => p.id === id)
      return procedureType[0].name
    },
    saveProcedure () {
      const data = {
        activity_id: this.$route.params.id,
        service_id: this.service.service_id,
        amount: this.service.amount,
        remarks: this.service.remarks
      }
      if (this.service.id) {
        data['id'] = this.service.id
      }
      activityServices.createActivityService(data).then(response => {
        if (response.data.success) {
          this.fetchAllActivityServices()
        }
        this.$swal(response?.data?.message)
      }).catch(err => {
        console.log(err)
        this.$swal.fire(
          'Cannot add service!',
          'Please check your internet connection',
          'error'
        )
        this.isLoading = false
      })

      this.service = { service_id: null, amount: 0 }
      this.$bvModal.hide('modal-add-procedure')
    },
    proceedTreatment () {
      if (this.detail.doctor_id === null && this.doctor_id !== null) {
        this.detail.doctor_id = this.doctor_id
      }
      if ((this.detail.doctor_id === undefined || (this.detail.doctor_id === null && this.doctor_id === null)) && this.detail.is_dentist_required) {
        this.$swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: this.userDetails.role === 'DA' ? 'Select Dentist first before you proceed!' : "Oops, can't proceed dental assistant must assign a doctor first."
        })
        return false
      }
      this.updateActivity('ongoing')
    },
    cancelTreatment () {
        this.$swal.fire({
          title: 'Are you sure you want to cancel this activity?',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'No'
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            this.updateActivity('cancelled')
          }
        })
    },
    markAsDone () {
      if (this.detail.is_dentist_required && (!this.detail.services.length)) {
        this.$swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Sorry cannot be mark as done, service avail is empty.'
        })
        return false
      } else if (this.detail.is_dentist_required && (!this.detail?.dental_assistant)) {
        this.$swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Sorry cannot be mark as done, dental assistant is empty.'
        })
        return false
      } else {
        this.$swal.fire({
          title: 'Are you sure you want to mark this as done?',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'No'
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            this.updateActivity('done')
          }
        })
      }
    },
    settlePayment () {
      if (this.balance > 0) {
        this.$swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Sorry cannot be settled. Still have remaining balance'
        })
        return false
      }
      this.$swal.fire({
        title: 'Are you sure you want to settle this activity?',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.updateActivity('done', true)
        }
      })
    },
    settlePaymentWithBalance () {
      this.$swal.fire({
        title: 'Are you sure you want to settle this activity with balance of ' + this.balance + '?',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.updateActivityWithBalance()
        }
      })
    },
    updateRemarks () {
      this.$swal.fire({
        title: 'Are you sure you want to update the remarks?',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.saveRemarks()
        }
      })
    },
    saveRemarks () {
      activity.updateRemarks(this.detail, this.detail.id).then(resp => {
        this.$swal.fire(
          'Remarks saved successfully!',
          'This activity remarks has been saved successfully!',
          'success'
        )
        this.$router.push('/activityLogs/activity-logs')
      })
    },
    updateActivityWithBalance () {
      this.isLoading = true
      activity.settleWithBalance(this.tenderPayments, this.detail.id).then(resp => {
        if (resp.data.success) {
          this.$swal.fire(
            'Settled successfully!',
            'This activity has been settled with balance of ' + this.balance,
            'success'
          )
          this.isLoading = false
          this.$router.push('/activityLogs/activity-logs')
        } else {
          this.$swal.fire(
                  'Not able to update the status!',
                  'internal server error!',
                  'error'
                )
          this.isLoading = false
        }
      }).catch(err => {
        console.log(err)
        this.$swal.fire(
          'Not able to update the status!',
          'Please check your internet connection',
          'error'
        )
        this.isLoading = false
      })
    },
    updateActivity (status, isPaid = false) {
      this.isLoading = true
      this.detail.dental_assistant = this.dental_assistant
      let params = _.cloneDeep(this.detail)
      params.status = status
      params.is_paid = isPaid ? 'Y' : 'N'
      activity.updateActivity(params, this.detail.id).then(response => {
        if (response.data.success) {
          const respData = response.data.data
          this.detail = respData
          this.detail.status = status

          if (isPaid) {
            activity.savePayment(this.tenderPayments, this.detail.id).then(resp => {
              if (resp.data.success) {
                this.$swal.fire(
                  'Payment Saved!',
                  'This activity has been settled',
                  'success'
                )
                this.detail.is_paid = isPaid ? 'Y' : 'N'
                this.$router.push('/activityLogs/activity-logs')
              }
            })
          }
          this.isLoading = false
          this.changeFieldView()
        } else {
          this.$swal.fire(
                  'Not able to update the status!',
                  'internal server error!',
                  'error'
                )
          this.isLoading = false
        }
      }).catch(err => {
        console.log(err)
        this.$swal.fire(
          'Not able to update the status!',
          'Please check your internet connection',
          'error'
        )
        this.isLoading = false
      })
    },
    savePayment () {
      const paymentType = this.paymentTypes.filter(pt => pt.id === this.payment.payment_type_id)[0]
      this.tenderPayments.push({ id: this.payment.payment_type_id, type: paymentType.name, amount: this.payment.amount, account_name: this.payment.account_name, reference_number: this.payment.reference_number })
      this.payment = { payment_type_id: null, amount: 0, account_name: null, reference_number: null }
      this.$bvModal.hide('modal-add-payment')
    },
    handleSaveAdditionalCommission (action = 'add') {
      this.$swal.fire({
        title: `Are you sure you want to ${action} additional commission?`,
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          if (!action === 'add') {
            this.detail.additional_commission = 0
            this.detail.additional_commission_remarks = ''
          }
          this.saveAdditionalCommission(action)
        }
      })
    },
    saveAdditionalCommission (action) {
      activity.saveAdditionalCommission(this.detail, this.detail.id).then(resp => {
        this.$swal.fire(
          'Additional commission!',
          `Additional commission ${action === 'add' ? 'saved' : 'deleted'} successfully!`,
          'success'
        )
      })

      this.additionalCommissionInfo.amount = this.detail.additional_commission
      this.additionalCommissionInfo.remarks = this.detail.additional_commission_remarks
      this.$bvModal.hide('modal-additional-commission')
    },
    handleSaveAdditionalPayable () {
      this.$swal.fire({
        title: 'Are you sure you want to add additional payable for this patient?',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.saveAdditionalPayable()
        }
      })
    },
    saveAdditionalPayable () {
      const id = this.$route.params.id
      console.log(this.additionalPayableAmount)
      const data = {
        activity_id: id,
        amount: this.additionalPayableAmount,
        type: this.additionalPayableType,
        description: this.additionalPayableDescription
      }
      // console.log(this.payable)
      this.payable.activity_id = id
      console.log(this.payable)
      additionalPayable.createAdditionalPayable(data).then(resp => {
        this.$swal.fire(
          'Additional payable!',
          'Additional payable saved successfully!',
          'success'
        )
        if (resp.data.success) {
          this.additionalPayableAmount = ''
          this.additionalPayableDescription = ''
          this.additionalPayableType = ''
          this.$bvModal.hide('modal-additional-payable')
          this.fetchActivityAdditionalPayables()
        }
      })
    },
    handleAddDiscount () {
      this.$swal.fire({
        title: 'Are you sure you want to add Discount?',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          if (this.isCustomDiscount) {
            this.saveCustomDiscount()
          } else {
            this.saveDiscount()
          }
        }
      })
    },
    isNumber (evt) {
      evt = evt ?? window.event
      var charCode = evt.which ? evt.which : evt.keyCode
      if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46 && charCode !== 44) {
        evt.preventDefault()
      }
      return true
    },
    saveCustomDiscount () {
      activity.saveCustomDiscount(this.discountForm, this.detail.id).then(resp => {
        this.$swal.fire(
          'Discount!',
          'Discount saved successfully!',
          'success'
        )
        if (resp.data.success) {
          var respData = resp.data.data
          let discountName = respData?.name
          if (respData?.is_fixed_amount === 'Y') {
            discountName += ' ' + respData?.discount_amount + ''
          } else {
            discountName += ' ' + respData?.discount_rate + '%'
          }
          this.tenderDiscount.push({ id: respData.id, name: discountName, discountedAmount: parseFloat(respData.discount_amount) })
          this.newDiscountId = 0
          this.newDiscountIdNumber = null
          this.isCustomDiscount = false
          this.clearNewDiscountForm()
        }
      })
      this.$bvModal.hide('modal-add-discount')
    },
    saveDiscount () {
      const data = {
        discount_id: this.newDiscountId,
        id_number: this.newDiscountIdNumber
      }
      activity.saveDiscount(data, this.detail.id).then(resp => {
        this.$swal.fire(
          'Discount!',
          'Discount saved successfully!',
          'success'
        )

        if (resp.data.success) {
          var respData = resp.data.data

          const discount = this.discounts.filter(pt => pt.id === this.newDiscountId)[0]

          let discountName = discount.name
          if (discount.is_fixed_amount === 'Y') {
            discountName += ' ' + discount.discount_amount + ''
          } else {
            discountName += ' ' + discount.discount_rate + '%'
          }
          this.tenderDiscount.push({ id: respData.id, name: discountName, discountedAmount: parseFloat(respData.discount_amount) })
          this.newDiscountId = 0
          this.newDiscountIdNumber = null
        }
      })
      this.$bvModal.hide('modal-add-discount')
    },
    handleRemoveDiscount (index, id) {
      this.$swal.fire({
        title: 'Are you sure you want to remove Discount?',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.removeDiscount(index, id)
        }
      })
    },
    removeDiscount (index, id) {
      activity.removeDiscount(id).then(resp => {
        this.$swal.fire(
          'Discount!',
          'Discount removed successfully!',
          'success'
        )

        if (resp.data.success) {
          this.tenderDiscount.splice(index, 1)
        }
      })
    }
  }
}
</script>

<style scoped>
.payment-container {
    width: 100%;
    border: 1px solid;
    padding: 6px;
    background-color: #ffffce;
}
.pct-row {
  display: flex;
}
.pct-row >.pct-row-label {
    display: inline;
    text-align: left;
    width: 50%;
    font-weight: bold;
}
.pct-row > .pct-row-amount {
    display: inline;
    text-align: right;
    width: 50%;
}
.payment-container-totals {
    border-top: dashed;
}
.settle-btn {
  font-size: 37px !important;
  padding-left: 12px !important;
  padding-right: 12px !important;
}
</style>
