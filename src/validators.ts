/**
 * Input validators
 */

import { z } from 'zod';
import { WALLET_ADDRESS_REGEX, POLYMARKET_URL_PATTERN } from './config';
import { ValidationError } from './types';

/**
 * Validate wallet address
 */
export function validateWalletAddress(address: string): void {
  if (!WALLET_ADDRESS_REGEX.test(address)) {
    throw new ValidationError(
      'Invalid wallet address. Please provide a valid Ethereum address (0x...)'
    );
  }
}

/**
 * Extract market ID from Polymarket URL
 */
export function extractMarketId(input: string): string {
  // Check if it's a Polymarket URL
  if (input.includes('polymarket.com')) {
    const match = input.match(POLYMARKET_URL_PATTERN);
    if (match && match[1]) {
      return match[1];
    }
    throw new ValidationError('Could not extract market ID from URL');
  }

  // Return as-is if not a URL
  return input;
}

/**
 * Validate market ID
 */
export function validateMarketId(marketId: string): void {
  if (!marketId || typeof marketId !== 'string' || marketId.trim().length === 0) {
    throw new ValidationError('Invalid market ID');
  }
}

/**
 * Validate threshold value
 */
export function validateThreshold(threshold: number): void {
  if (typeof threshold !== 'number' || threshold < 0 || threshold > 100) {
    throw new ValidationError('Threshold must be a number between 0 and 100');
  }
}

/**
 * Validate limit value
 */
export function validateLimit(limit: number): void {
  if (typeof limit !== 'number' || limit < 1 || limit > 50) {
    throw new ValidationError('Limit must be a number between 1 and 50');
  }
}

/**
 * Validate min edge value
 */
export function validateMinEdge(minEdge: number): void {
  if (typeof minEdge !== 'number' || minEdge < 0 || minEdge > 100) {
    throw new ValidationError('Min edge must be a number between 0 and 100');
  }
}

/**
 * Validate category string
 */
export function validateCategory(category: string): void {
  if (category && typeof category !== 'string') {
    throw new ValidationError('Category must be a string');
  }
}

// Zod schemas for command parameters
export const AlphaParamsSchema = z.object({
  limit: z.number().optional().default(5),
  minEdge: z.number().optional().default(3),
  category: z.string().optional(),
});

export const ConnectParamsSchema = z.object({
  address: z.string().describe('Wallet address (0x...)'),
});

export const AnalyzeParamsSchema = z.object({
  market: z.string().describe('Market ID, URL, or search query'),
});

export const TrackParamsSchema = z.object({
  market: z.string().describe('Market ID or URL'),
  threshold: z.number().optional().default(5).describe('Alert on edge change (%)'),
});

export const WalletParamsSchema = z.object({
  address: z.string().describe('Wallet address (0x...)'),
});
