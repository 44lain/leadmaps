import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SHEET_NAME = 'Página1';
const RANGE = 'A:Z';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('GOOGLE_SHEETS_API_KEY');
    const spreadsheetId = Deno.env.get('SPREADSHEET_ID');

    if (!apiKey) {
      throw new Error('GOOGLE_SHEETS_API_KEY not configured');
    }
    if (!spreadsheetId) {
      throw new Error('SPREADSHEET_ID not configured');
    }

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${SHEET_NAME}!${RANGE}?key=${apiKey}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Google Sheets API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.values || data.values.length === 0) {
      return new Response(
        JSON.stringify({ leads: [], message: 'Nenhum dado encontrado na planilha' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // First row is headers
    const headers = data.values[0].map((h: string) => h.toLowerCase().trim());
    const rows = data.values.slice(1);

    // Convert rows to objects
    const leads = rows.map((row: string[]) => {
      const lead: Record<string, string> = {};
      headers.forEach((header: string, index: number) => {
        lead[header] = row[index] || '';
      });
      return lead;
    });

    return new Response(
      JSON.stringify({ 
        leads, 
        total: leads.length,
        message: `${leads.length} leads encontrados` 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error fetching sheets:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        leads: [] 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
