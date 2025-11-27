// PawTag India - Notification Service
// Handles SMS, Email, WhatsApp, and Push notifications

import { Pet, User, ScanEvent, GeoLocation, NotificationType, NotificationLog } from '../types';
import { StorageService } from './storageService';

// Configuration for notification providers
const CONFIG = {
  // In production, these would be actual API endpoints
  SMS_API: '/api/sms', // MSG91 or Twilio
  EMAIL_API: '/api/email', // SendGrid or SES
  WHATSAPP_API: '/api/whatsapp', // WhatsApp Business API
  BASE_URL: window.location.origin
};

// Generate the pet profile URL
const getPetProfileUrl = (tagCode: string): string => {
  return `${CONFIG.BASE_URL}/pet/${tagCode}`;
};

// Format location for message
const formatLocation = (location?: GeoLocation): string => {
  if (!location) return 'Location not available';

  const parts = [];
  if (location.address) parts.push(location.address);
  if (location.city) parts.push(location.city);
  if (location.state) parts.push(location.state);

  if (parts.length === 0 && location.latitude && location.longitude) {
    return `GPS: ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`;
  }

  return parts.join(', ') || 'Location not available';
};

// Generate Google Maps link
const getGoogleMapsLink = (location?: GeoLocation): string | null => {
  if (!location || !location.latitude || !location.longitude) return null;
  return `https://maps.google.com/maps?q=${location.latitude},${location.longitude}`;
};

export const NotificationService = {
  /**
   * Send all configured notifications when a tag is scanned
   */
  notifyOwnerOfScan: async (
    pet: Pet,
    owner: User,
    scan: ScanEvent
  ): Promise<NotificationType[]> => {
    const sentNotifications: NotificationType[] = [];
    const prefs = owner.notificationPreferences;

    // SMS Notification
    if (prefs.sms && owner.phone) {
      try {
        await NotificationService.sendSMS(owner, pet, scan);
        sentNotifications.push('sms');
      } catch (error) {
        console.error('SMS notification failed:', error);
      }
    }

    // Email Notification
    if (prefs.email && owner.email) {
      try {
        await NotificationService.sendEmail(owner, pet, scan);
        sentNotifications.push('email');
      } catch (error) {
        console.error('Email notification failed:', error);
      }
    }

    // WhatsApp Notification (key differentiator for India)
    if (prefs.whatsapp && owner.phone) {
      try {
        await NotificationService.sendWhatsApp(owner, pet, scan);
        sentNotifications.push('whatsapp');
      } catch (error) {
        console.error('WhatsApp notification failed:', error);
      }
    }

    // Log notifications
    sentNotifications.forEach(type => {
      const log: NotificationLog = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId: owner.id,
        petId: pet.id,
        scanId: scan.id,
        type,
        status: 'sent',
        message: `Scan alert for ${pet.name}`,
        sentAt: new Date().toISOString()
      };
      StorageService.saveNotification(log);
    });

    return sentNotifications;
  },

  /**
   * Send SMS notification
   */
  sendSMS: async (owner: User, pet: Pet, scan: ScanEvent): Promise<void> => {
    const location = formatLocation(scan.location);
    const mapsLink = getGoogleMapsLink(scan.location);

    let message = `PAWTAG ALERT: ${pet.name}'s tag was just scanned!`;
    message += `\n\nLocation: ${location}`;

    if (scan.finderName) {
      message += `\n\nFinder: ${scan.finderName}`;
      if (scan.finderPhone) message += `\nPhone: ${scan.finderPhone}`;
      if (scan.finderMessage) message += `\nMessage: "${scan.finderMessage}"`;
    }

    if (mapsLink) {
      message += `\n\nView on Map: ${mapsLink}`;
    }

    message += `\n\nTime: ${new Date(scan.scannedAt).toLocaleString('en-IN')}`;

    // In production, integrate with MSG91 or Twilio
    console.log('[SMS] Sending to:', owner.phone);
    console.log('[SMS] Message:', message);

    // Demo mode - simulate API call
    // In production:
    // await fetch(CONFIG.SMS_API, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     to: owner.phone,
    //     message: message
    //   })
    // });
  },

  /**
   * Send Email notification
   */
  sendEmail: async (owner: User, pet: Pet, scan: ScanEvent): Promise<void> => {
    const location = formatLocation(scan.location);
    const mapsLink = getGoogleMapsLink(scan.location);
    const tag = StorageService.getTagById(pet.tagId);

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #FF6B35, #FF8C5F); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .alert-box { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .info-box { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .finder-info { background: #d4edda; border: 1px solid #28a745; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .button { display: inline-block; background: #FF6B35; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 10px 5px; }
          .button-secondary { background: #28a745; }
          .pet-photo { width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 4px solid white; margin: -50px auto 20px; display: block; }
          .label { color: #666; font-size: 12px; text-transform: uppercase; margin-bottom: 5px; }
          .value { font-size: 16px; font-weight: 600; color: #333; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>PawTag Alert!</h1>
            <p>${pet.name}'s tag was scanned</p>
          </div>
          <div class="content">
            ${pet.photoUrl ? `<img src="${pet.photoUrl}" alt="${pet.name}" class="pet-photo">` : ''}

            <div class="alert-box">
              <strong>Good news!</strong> Someone scanned ${pet.name}'s PawTag. Here are the details:
            </div>

            <div class="info-box">
              <div class="label">Location</div>
              <div class="value">${location}</div>
              ${mapsLink ? `<a href="${mapsLink}" class="button" style="margin-top: 10px;">View on Google Maps</a>` : ''}
            </div>

            <div class="info-box">
              <div class="label">Time of Scan</div>
              <div class="value">${new Date(scan.scannedAt).toLocaleString('en-IN', {
                dateStyle: 'full',
                timeStyle: 'short'
              })}</div>
            </div>

            ${scan.finderName ? `
              <div class="finder-info">
                <h3>Finder Information</h3>
                <p><strong>Name:</strong> ${scan.finderName}</p>
                ${scan.finderPhone ? `<p><strong>Phone:</strong> <a href="tel:${scan.finderPhone}">${scan.finderPhone}</a></p>` : ''}
                ${scan.finderMessage ? `<p><strong>Message:</strong> "${scan.finderMessage}"</p>` : ''}
                ${scan.finderPhone ? `
                  <a href="tel:${scan.finderPhone}" class="button">Call Finder</a>
                  <a href="https://wa.me/${scan.finderPhone.replace(/[^0-9]/g, '')}" class="button button-secondary">WhatsApp</a>
                ` : ''}
              </div>
            ` : ''}

            <div class="info-box">
              <div class="label">Pet Details</div>
              <p><strong>${pet.name}</strong> - ${pet.breed} (${pet.type})</p>
              <p>Tag Code: ${tag?.code || 'N/A'}</p>
            </div>

            <p style="text-align: center; margin-top: 30px;">
              <a href="${CONFIG.BASE_URL}/dashboard" class="button">Go to Dashboard</a>
            </p>

            <p style="color: #666; font-size: 12px; text-align: center; margin-top: 30px;">
              This is an automated notification from PawTag India.<br>
              You received this because you registered ${pet.name} with PawTag.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    console.log('[Email] Sending to:', owner.email);
    console.log('[Email] Subject:', `ALERT: ${pet.name}'s PawTag was scanned!`);

    // In production, integrate with SendGrid or AWS SES
    // await fetch(CONFIG.EMAIL_API, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     to: owner.email,
    //     subject: `ALERT: ${pet.name}'s PawTag was scanned!`,
    //     html: html
    //   })
    // });
  },

  /**
   * Send WhatsApp notification (India-specific feature)
   */
  sendWhatsApp: async (owner: User, pet: Pet, scan: ScanEvent): Promise<void> => {
    const location = formatLocation(scan.location);
    const mapsLink = getGoogleMapsLink(scan.location);

    // WhatsApp message template (would use WhatsApp Business API template in production)
    let message = `*PAWTAG ALERT*\n\n`;
    message += `Your pet *${pet.name}*'s tag was just scanned!\n\n`;
    message += `*Location:* ${location}\n`;
    message += `*Time:* ${new Date(scan.scannedAt).toLocaleString('en-IN')}\n`;

    if (scan.finderName) {
      message += `\n*Finder Details:*\n`;
      message += `Name: ${scan.finderName}\n`;
      if (scan.finderPhone) message += `Phone: ${scan.finderPhone}\n`;
      if (scan.finderMessage) message += `Message: "${scan.finderMessage}"\n`;
    }

    if (mapsLink) {
      message += `\n*View Location:* ${mapsLink}`;
    }

    console.log('[WhatsApp] Sending to:', owner.phone);
    console.log('[WhatsApp] Message:', message);

    // In production, use WhatsApp Business API
    // This is a key differentiator for the Indian market
    // await fetch(CONFIG.WHATSAPP_API, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     to: owner.phone,
    //     template: 'pet_scan_alert',
    //     params: {
    //       pet_name: pet.name,
    //       location: location,
    //       time: new Date(scan.scannedAt).toLocaleString('en-IN'),
    //       finder_name: scan.finderName || '',
    //       maps_link: mapsLink || ''
    //     }
    //   })
    // });
  },

  /**
   * Send notification when pet is marked as lost
   */
  notifyPetMarkedLost: async (pet: Pet, owner: User): Promise<void> => {
    const tag = StorageService.getTagById(pet.tagId);
    const profileUrl = tag ? getPetProfileUrl(tag.code) : '';

    const message = `ALERT: You have marked ${pet.name} as LOST on PawTag.\n\n` +
      `Anyone who scans the tag will see the LOST alert and your contact information.\n\n` +
      `Pet Profile: ${profileUrl}\n\n` +
      `Stay strong! We hope ${pet.name} comes home safely soon.`;

    console.log('[Lost Pet Alert] Sending to:', owner.phone);
    console.log('[Lost Pet Alert] Message:', message);
  },

  /**
   * Send notification when pet is found
   */
  notifyPetFound: async (pet: Pet, owner: User): Promise<void> => {
    const message = `GREAT NEWS! ${pet.name} has been marked as FOUND!\n\n` +
      `We're so happy ${pet.name} is back home safe. ` +
      `Thank you for using PawTag India!`;

    console.log('[Pet Found Alert] Sending to:', owner.phone);
    console.log('[Pet Found Alert] Message:', message);
  },

  /**
   * Generate WhatsApp click-to-chat link (useful for finder to contact owner)
   */
  getWhatsAppLink: (phone: string, message?: string): string => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const encodedMessage = message ? encodeURIComponent(message) : '';
    return `https://wa.me/${cleanPhone}${encodedMessage ? `?text=${encodedMessage}` : ''}`;
  },

  /**
   * Generate call link
   */
  getCallLink: (phone: string): string => {
    return `tel:${phone}`;
  }
};
