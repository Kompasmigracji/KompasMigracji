-- Stage 5: Partner Marketplace Module

-- Table for storing partners (businesses, lawyers, landlords, etc.)
CREATE TABLE IF NOT EXISTS public.kompas_partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- e.g., 'Legal', 'Housing', 'Finance', 'Health', 'Education'
    description TEXT,
    logo_url TEXT,
    website_url TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    verification_status TEXT DEFAULT 'Pending', -- 'Pending', 'Verified', 'Suspended'
    rating NUMERIC(3, 2) DEFAULT 5.00, -- e.g. 4.95
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Table for specific offers/discounts provided by the partners
CREATE TABLE IF NOT EXISTS public.kompas_partner_offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    partner_id UUID REFERENCES public.kompas_partners(id) ON DELETE CASCADE,
    title TEXT NOT NULL, -- e.g., '15% Off Translation Services'
    description TEXT,
    discount_type TEXT, -- e.g., 'Percentage', 'Fixed Amount', 'Free Tier'
    discount_value NUMERIC, -- e.g., 15.00
    promo_code TEXT, -- The code members will use
    is_active BOOLEAN DEFAULT true,
    valid_until DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- RLS
ALTER TABLE public.kompas_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kompas_partner_offers ENABLE ROW LEVEL SECURITY;

-- Everyone (or authenticated members) can read verified partners
CREATE POLICY "Anyone can view verified partners" ON public.kompas_partners
    FOR SELECT USING (verification_status = 'Verified');

-- Everyone (or authenticated members) can read active offers
CREATE POLICY "Anyone can view active offers" ON public.kompas_partner_offers
    FOR SELECT USING (is_active = true);

-- Admins can do everything
