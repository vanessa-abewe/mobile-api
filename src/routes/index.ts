
import express from 'express';
const router = express.Router();

import appReleasesRoutes from './appReleases.routes';
import appointmentsRoutes from './appointments.routes';
import appsRoutes from './apps.routes';
import auditTrailRoutes from './auditTrail.routes';
import categoriesRoutes from './categories.routes';
import changeRequestRoutes from './changeRequest.routes';
import deviceRoutes from './device.routes';
import deviceHeartbeatRoutes from './deviceHeartbeat.routes';
import institutionRoutes from './institution.routes';
import institutionInvoicesRoutes from './institutionInvoices.routes';
import institutionServiceTrackingRoutes from './institutionServiceTracking.routes';
import loginHistoryRoutes from './loginHistory.routes';
import migrationRoutes from './migration.routes';
import mmsFileRoutes from './mmsFile.routes';
import notificationRoutes from './notification.routes';
import notificationRecipientRoutes from './notificationRecipient.routes';
import optionRoutes from './option.routes';
import organisationRoutes from './organisation.routes';
import popupQuestionsRoutes from './popupQuestions.routes';
import popupQuestionsAnswersRoutes from './popupQuestionsAnswers.routes';
import popupQuestionsPossibleAnswersRoutes from './popupQuestionsPossibleAnswers.routes';
import qmsBranchOperatorRoutes from './qmsBranchOperator.routes';
import qmsBranchTransactionsRoutes from './qmsBranchTransactions.routes';
import qmsCounterRoutes from './qmsCounter.routes';
import qmsCustomerRoutes from './qmsCustomer.routes';
import qmsOperatorRoutes from './qmsOperator.routes';
import qmsOperatorTransactionsRoutes from './qmsOperatorTransactions.routes';
import qmsQueueRoutes from './qmsQueue.routes';
import qmsQueueOperatorLnkRoutes from './qmsQueueOperatorLnk.routes';
import qmsTicketRoutes from './qmsTicket.routes';
import qmsTicketAssignmentRoutes from './qmsTicketAssignment.routes';
import qmsWhatsappProgressRoutes from './qmsWhatsappProgress.routes';
import ratingRoutes from './rating.routes';
import ratingAssetsRoutes from './ratingAssets.routes';
import ratingQrCodeSessionsRoutes from './ratingQrCodeSessions.routes';
import ratingReplyRoutes from './ratingReply.routes';
import reportsRoutes from './reports.routes';
import requestInstitutionRoutes from './requestInstitution.routes';
import serviceRoutes from './service.routes';
import serviceGroupRoutes from './serviceGroup.routes';
import subscriptionPlansRoutes from './subscriptionPlans.routes';
import surveyRoutes from './survey.routes';
import surveyResultRoutes from './surveyResult.routes';
import tagsRoutes from './tags.routes';
import tipRoutes from './tip.routes';
import userRoutes from './user.routes';
import walletAccountsRoutes from './walletAccounts.routes';
import walletAccountsTypesRoutes from './walletAccountsTypes.routes';
import walletTransfersRoutes from './walletTransfers.routes';
import walletUsersRoutes from './walletUsers.routes';

import productsRoutes from "./products.routes"
import userHasServiceRoutes from "./userHasService.routes"
import institutionFollowRoutes from "./institutionFollow.routes"
import imagesRoutes from "./images.routes"
import amenitiesRoutes from "./amenities.routes"
import businessAmenitiesRoutes from "./businessAmenities.routes"

import authRoutes from './auth';

router.use('/auth', authRoutes);
router.use('/app_releases', appReleasesRoutes);
router.use('/appointments', appointmentsRoutes);
router.use('/apps', appsRoutes);
router.use('/audit_trail', auditTrailRoutes);
router.use('/categories', categoriesRoutes);
router.use('/change_request', changeRequestRoutes);
router.use('/device', deviceRoutes);
router.use('/device_heartbeat', deviceHeartbeatRoutes);
router.use('/institution', institutionRoutes);
router.use('/institution_invoices', institutionInvoicesRoutes);
router.use('/institution_service_tracking', institutionServiceTrackingRoutes);
router.use('/login_history', loginHistoryRoutes);
router.use('/migration', migrationRoutes);
router.use('/mms_file', mmsFileRoutes);
router.use('/notification', notificationRoutes);
router.use('/notification_recipient', notificationRecipientRoutes);
router.use('/option', optionRoutes);
router.use('/organisation', organisationRoutes);
router.use('/popup_questions', popupQuestionsRoutes);
router.use('/popup_questions_answers', popupQuestionsAnswersRoutes);
router.use('/popup_questions_possible_answers', popupQuestionsPossibleAnswersRoutes);
router.use('/qms_branch_operator', qmsBranchOperatorRoutes);
router.use('/qms_branch_transactions', qmsBranchTransactionsRoutes);
router.use('/qms_counter', qmsCounterRoutes);
router.use('/qms_customer', qmsCustomerRoutes);
router.use('/qms_operator', qmsOperatorRoutes);
router.use('/qms_operator_transactions', qmsOperatorTransactionsRoutes);
router.use('/qms_queue', qmsQueueRoutes);
router.use('/qms_queue_operator_lnk', qmsQueueOperatorLnkRoutes);
router.use('/qms_ticket', qmsTicketRoutes);
router.use('/qms_ticket_assignment', qmsTicketAssignmentRoutes);
router.use('/qms_whatsApp_progress', qmsWhatsappProgressRoutes);
router.use('/rating', ratingRoutes);
router.use('/rating_assets', ratingAssetsRoutes);
router.use('/rating_qr_code_sessions', ratingQrCodeSessionsRoutes);
router.use('/rating_reply', ratingReplyRoutes);
router.use('/reports', reportsRoutes);
router.use('/request_institution', requestInstitutionRoutes);
router.use('/service', serviceRoutes);
router.use('/service_group', serviceGroupRoutes);
router.use('/subscription_plans', subscriptionPlansRoutes);
router.use('/survey', surveyRoutes);
router.use('/survey_result', surveyResultRoutes);
router.use('/tags', tagsRoutes);
router.use('/tip', tipRoutes);
router.use('/user', userRoutes);
router.use('/wallet_accounts', walletAccountsRoutes);
router.use('/wallet_accounts_types', walletAccountsTypesRoutes);
router.use('/wallet_transfers', walletTransfersRoutes);
router.use('/wallet_users', walletUsersRoutes);

router.use("/products", productsRoutes)
router.use("/user_has_service", userHasServiceRoutes)
router.use("/institution_follow", institutionFollowRoutes)
router.use("/images", imagesRoutes)
router.use("/amenities", amenitiesRoutes)
router.use("/business_amenities", businessAmenitiesRoutes)

export default router;