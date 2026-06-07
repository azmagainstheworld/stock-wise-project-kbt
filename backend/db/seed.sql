INSERT INTO businesses (id, shop_name, business_type)
VALUES ('00000000-0000-0000-0000-000000000001', 'My Shop', 'FMCG')
ON CONFLICT (id) DO NOTHING;

INSERT INTO business_settings (business_id, stock_threshold)
VALUES ('00000000-0000-0000-0000-000000000001', 5)
ON CONFLICT (business_id) DO NOTHING;

INSERT INTO products (business_id, name, sku, category, price, stock)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Tepung Terigu', 'SKU-001', 'Lainnya', 25000, 50),
  ('00000000-0000-0000-0000-000000000001', 'Gula Pasir', 'SKU-002', 'Lainnya', 15000, 30)
ON CONFLICT (business_id, sku) DO NOTHING;
