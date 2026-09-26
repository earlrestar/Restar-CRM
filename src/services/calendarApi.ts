export interface GoogleCalendarEventInput {
  summary: string;
  description?: string;
  location?: string;
  start: {
    dateTime: string; // ISO 8601 string
    timeZone?: string;
  };
  end: {
    dateTime: string;
    timeZone?: string;
  };
  attendees?: Array<{ email: string; displayName?: string }>;
  reminders?: {
    useDefault: boolean;
    overrides?: Array<{ method: 'popup' | 'email'; minutes: number }>;
  };
  conferenceData?: any;
}

export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  hangoutLink?: string;
  htmlLink?: string;
  attendees?: Array<{ email: string; displayName?: string; responseStatus?: string }>;
}

export async function fetchCalendarEvents(
  accessToken: string,
  timeMin?: string,
  timeMax?: string
): Promise<{ success: boolean; events?: GoogleCalendarEvent[]; error?: string }> {
  try {
    const params = new URLSearchParams({
      calendarId: 'primary',
      singleEvents: 'true',
      orderBy: 'startTime',
      maxResults: '100',
    });

    if (timeMin) params.set('timeMin', timeMin);
    if (timeMax) params.set('timeMax', timeMax);

    const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params.toString()}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Your Google connection has expired. Please reconnect your Google account in Settings.');
      }
      if (response.status === 403) {
        throw new Error('Calendar permission was not granted. Please re-authenticate your Google Account.');
      }
      throw new Error(`Calendar API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      events: data.items || [],
    };
  } catch (error: any) {
    console.error('Fetch calendar events failed:', error);
    return {
      success: false,
      error: error.message || 'Unable to retrieve Google Calendar events.',
    };
  }
}

export async function createGoogleCalendarEvent(
  accessToken: string,
  event: GoogleCalendarEventInput
): Promise<{ success: boolean; event?: GoogleCalendarEvent; error?: string }> {
  try {
    const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Your Google connection has expired. Please reconnect your Google account.');
      }
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `Failed to create calendar event (${response.status})`);
    }

    const createdEvent = await response.json();
    return {
      success: true,
      event: createdEvent,
    };
  } catch (error: any) {
    console.error('Create calendar event failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to create event in Google Calendar.',
    };
  }
}

export async function testCalendarConnection(
  accessToken: string
): Promise<{ success: boolean; calendarTitle?: string; error?: string }> {
  try {
    const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Your Google connection has expired. Please reconnect your Google account.');
      }
      throw new Error(`Calendar test failed (${response.status})`);
    }

    const data = await response.json();
    return {
      success: true,
      calendarTitle: data.summary || 'Primary Calendar',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to connect to Google Calendar.',
    };
  }
}
