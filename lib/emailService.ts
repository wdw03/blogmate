
import { supabase } from './supabase';

/**
 * EmailJS Configuration & Routing
 * Supports 3 separate accounts to bypass free tier template limits.
 */

interface EmailAccount {
  serviceId: string;
  publicKey: string;
  accessToken?: string;
}

const getAccountForTemplate = (templateId: string): EmailAccount => {
  const env = import.meta.env;

  // Fallback Values (Provided by User)
  const FALLBACKS = {
    SERVICE_1: 'service_b6488j9',
    PUBLIC_1: 'zgN4Lpv0U3fF_gloh',
    PRIVATE_1: 'Zc1p7L6VsdZ62vfX_3DyP',
    
    SERVICE_2: 'service_zv97hta',
    PUBLIC_2: 'GAEcMDJOIDhKTWJDL',
    PRIVATE_2: '3H7vyLhfCHeQHqFBA5grt',
    
    SERVICE_3: 'service_bj453bf',
    PUBLIC_3: 'IqLbBC2sghTD20x61',
    PRIVATE_3: 'b6zbbOuTGvTz0samq_Y6u',

    T_WELCOME: 'template_bwhy6rp',
    T_RESET: 'template_kiuehl7',
    T_ORDER: 'template_lcu6kap',
    T_PAYMENT: 'template_0n7482f',
    T_STATUS: 'template_wd64qu4',
    T_MESSAGE: 'template_slfd4gn'
  };

  const welcomeT = env.VITE_EMAILJS_TEMPLATE_WELCOME || FALLBACKS.T_WELCOME;
  const resetT = env.VITE_EMAILJS_TEMPLATE_PASSWORD_RESET || FALLBACKS.T_RESET;
  const orderT = env.VITE_EMAILJS_TEMPLATE_ORDER_CONFIRMATION || FALLBACKS.T_ORDER;
  const paymentT = env.VITE_EMAILJS_TEMPLATE_PAYMENT_SUCCESS || FALLBACKS.T_PAYMENT;
  const statusT = env.VITE_EMAILJS_TEMPLATE_STATUS_UPDATE || FALLBACKS.T_STATUS;
  const messageT = env.VITE_EMAILJS_TEMPLATE_NEW_MESSAGE || FALLBACKS.T_MESSAGE;

  // Account 1: Onboarding & Security
  if (templateId === welcomeT || templateId === resetT) {
    return {
      serviceId: env.VITE_EMAILJS_SERVICE_ID_1 || FALLBACKS.SERVICE_1,
      publicKey: env.VITE_EMAILJS_PUBLIC_KEY_1 || FALLBACKS.PUBLIC_1,
      accessToken: env.VITE_EMAILJS_PRIVATE_KEY_1 || FALLBACKS.PRIVATE_1
    };
  }

  // Account 2: Transactions
  if (templateId === orderT || templateId === paymentT) {
    return {
      serviceId: env.VITE_EMAILJS_SERVICE_ID_2 || FALLBACKS.SERVICE_2,
      publicKey: env.VITE_EMAILJS_PUBLIC_KEY_2 || FALLBACKS.PUBLIC_2,
      accessToken: env.VITE_EMAILJS_PRIVATE_KEY_2 || FALLBACKS.PRIVATE_2
    };
  }

  // Account 3: Notifications
  return {
    serviceId: env.VITE_EMAILJS_SERVICE_ID_3 || FALLBACKS.SERVICE_3,
    publicKey: env.VITE_EMAILJS_PUBLIC_KEY_3 || FALLBACKS.PUBLIC_3,
    accessToken: env.VITE_EMAILJS_PRIVATE_KEY_3 || FALLBACKS.PRIVATE_3
  };
};

/**
 * Sends email via EmailJS REST API
 */
export const sendEmailViaEmailJS = async (templateId: string, templateParams: any) => {
  const env = import.meta.env;
  
  // Resolve templateId if it was passed as undefined from env
  const resolvedTemplateId = templateId || (
    templateParams.type === 'welcome' ? (env.VITE_EMAILJS_TEMPLATE_WELCOME || 'template_bwhy6rp') :
    templateParams.type === 'reset' ? (env.VITE_EMAILJS_TEMPLATE_PASSWORD_RESET || 'template_kiuehl7') :
    templateParams.type === 'order' ? (env.VITE_EMAILJS_TEMPLATE_ORDER_CONFIRMATION || 'template_lcu6kap') :
    templateParams.type === 'payment' ? (env.VITE_EMAILJS_TEMPLATE_PAYMENT_SUCCESS || 'template_0n7482f') :
    templateParams.type === 'status' ? (env.VITE_EMAILJS_TEMPLATE_STATUS_UPDATE || 'template_wd64qu4') :
    (env.VITE_EMAILJS_TEMPLATE_NEW_MESSAGE || 'template_slfd4gn')
  );

  const account = getAccountForTemplate(resolvedTemplateId);
  
  if (!account.serviceId || !account.publicKey || !resolvedTemplateId) {
    console.warn("EmailJS configuration missing for template:", resolvedTemplateId);
    return { success: false, error: "Configuration Missing" };
  }

  // Validate recipient email
  if (!templateParams.to_email && !templateParams.to) {
    console.error("EmailJS Dispatch Error: The recipients address is empty (to_email missing in params)");
    return { success: false, error: "Recipient address is empty" };
  }

  try {
    const payload: any = {
      service_id: account.serviceId,
      template_id: resolvedTemplateId,
      user_id: account.publicKey,
      template_params: templateParams,
    };

    // Add access token if available for server-side/secure calls
    if (account.accessToken) {
      payload.accessToken = account.accessToken;
    }

    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    return { success: true };
  } catch (error: any) {
    console.error("EmailJS Dispatch Error:", error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Legacy support for direct HTML sending (Queued worker uses this)
 * Note: EmailJS requires pre-defined templates, so this will now 
 * attempt to use a generic 'Notification' template if possible.
 */
export const sendEmailDirect = async (to: string, subject: string, html: string) => {
  const env = import.meta.env;
  return sendEmailViaEmailJS(env.VITE_EMAILJS_TEMPLATE_NEW_MESSAGE, {
    to_email: to,
    subject: subject,
    message_html: html, // Ensure your EmailJS template has this variable
  });
};

/**
 * Queues email into Supabase for reliable background processing.
 */
export const queueEmail = async (to: string, subject: string, html: string) => {
  try {
    const { error } = await supabase.from('email_queue').insert([
      { recipient: to, subject, html_content: html, status: 'pending' }
    ]);
    if (error) throw error;
    return { success: true };
  } catch (e: any) {
    console.error("Registry Queue Error:", e.message);
    return { success: false, error: e.message };
  }
};

/**
 * Orchestrates Order Emails using specific EmailJS Templates
 */
export const dispatchOrderEmails = async (order: any, userProfile: any) => {
  const env = import.meta.env;
  const orderId = order.id.slice(0, 8).toUpperCase();
  const userName = userProfile?.full_name || 'Customer';
  const userEmail = userProfile?.email;
  const total = order.total_amount || order.total_price;

  const templateParams = {
    to_name: userName,
    to_email: userEmail,
    order_id: orderId,
    total_price: total,
    items_summary: order.items?.map((i: any) => i.domain_name).join(', ') || 'Domain Services',
    dashboard_url: `${window.location.origin}//profile`
  };

  // 1. Send Order Confirmation to Customer (Account 2)
  await sendEmailViaEmailJS(env.VITE_EMAILJS_TEMPLATE_ORDER_CONFIRMATION, templateParams);

  // 2. Send Alert to Admin (Account 3)
  await sendEmailViaEmailJS(env.VITE_EMAILJS_TEMPLATE_NEW_MESSAGE, {
    to_email: "dilkashr690@gmail.com",
    subject: `URGENT: New Order #${orderId}`,
    message_snippet: `New order from ${userName} for $${total}.`
  });
};
