export interface MentorGuidanceEntry {
  id: string;
  mentorName: string;
  mentorEmail: string;
  recipientId?: string;
  recipientName?: string;
  recipientEmail?: string;
  advice: string;
  createdAt: string;
}

const GUIDANCE_STORAGE_KEY = 'dc_mentor_guidance_inbox';
const GUIDANCE_UPDATED_EVENT = 'dc-mentor-guidance-updated';

const readInbox = (): MentorGuidanceEntry[] => {
  try {
    const raw = localStorage.getItem(GUIDANCE_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as MentorGuidanceEntry[]) : [];
  } catch {
    return [];
  }
};

const writeInbox = (entries: MentorGuidanceEntry[]): void => {
  localStorage.setItem(GUIDANCE_STORAGE_KEY, JSON.stringify(entries));
};

export const emitMentorGuidanceUpdated = (): void => {
  window.dispatchEvent(new Event(GUIDANCE_UPDATED_EVENT));
};

export const saveMentorGuidance = (entry: MentorGuidanceEntry): MentorGuidanceEntry => {
  const nextEntry = {
    ...entry,
    id: entry.id || `guidance-${Date.now()}`,
    createdAt: entry.createdAt || new Date().toISOString(),
  };

  const inbox = [nextEntry, ...readInbox()];
  writeInbox(inbox);
  emitMentorGuidanceUpdated();
  return nextEntry;
};

export const getMentorGuidanceForUser = (identifiers: {
  id?: string;
  email?: string;
  name?: string;
}): MentorGuidanceEntry[] => {
  const normalizedEmail = identifiers.email?.trim().toLowerCase();
  const normalizedName = identifiers.name?.trim().toLowerCase();

  return readInbox().filter((entry) => {
    if (identifiers.id && entry.recipientId && entry.recipientId === identifiers.id) {
      return true;
    }

    if (normalizedEmail && entry.recipientEmail?.trim().toLowerCase() === normalizedEmail) {
      return true;
    }

    if (normalizedName && entry.recipientName?.trim().toLowerCase() === normalizedName) {
      return true;
    }

    return false;
  });
};

export const clearMentorGuidanceInbox = (): void => {
  localStorage.removeItem(GUIDANCE_STORAGE_KEY);
  emitMentorGuidanceUpdated();
};

export const MENTOR_GUIDANCE_UPDATED_EVENT_NAME = GUIDANCE_UPDATED_EVENT;