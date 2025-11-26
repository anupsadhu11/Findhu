import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Property = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [searchData, setSearchData] = useState({
    property_address: '',
    property_type: '',
    search_type: '',
    state: '',
    district: ''
  });

  const [valuationData, setValuationData] = useState({
    property_address: '',
    property_type: '',
    area_sqft: '',
    location: '',
    state: '',
    age_of_property: '',
    amenities: ''
  });

  const handleLegalSearch = async () => {
    if (!searchData.property_address || !searchData.property_type || !searchData.search_type || !searchData.state) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API}/property/legal-search`,
        searchData,
        { withCredentials: true }
      );
      setResult(response.data);
      toast.success('Legal search complete!');
    } catch (error) {
      toast.error('Failed to perform legal search');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleValuation = async () => {
    if (!valuationData.property_address || !valuationData.area_sqft || !valuationData.state) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API}/property/valuation`,
        {
          ...valuationData,
          area_sqft: parseFloat(valuationData.area_sqft),
          age_of_property: parseInt(valuationData.age_of_property) || 0
        },
        { withCredentials: true }
      );
      setResult(response.data);
      toast.success('Property valuation complete!');
    } catch (error) {
      toast.error('Failed to get valuation');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  return (
    <Layout>
      <div className="p-6 lg:p-8" data-testid="property-page">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
            Property Services
          </h1>
          <p className="text-slate-600">Legal verification & property valuation for rural India</p>
        </div>

        <Tabs defaultValue="legal" className="space-y-6">
          <TabsList className="grid grid-cols-2 w-full max-w-md">
            <TabsTrigger value="legal" data-testid="tab-legal">Legal Search</TabsTrigger>
            <TabsTrigger value="valuation" data-testid="tab-valuation">Valuation</TabsTrigger>
          </TabsList>

          <TabsContent value="legal">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="p-6 rounded-2xl border-2 border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Property Legal Search</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="property-address">Property Address *</Label>
                    <Input
                      id="property-address"
                      data-testid="property-address-input"
                      placeholder="Plot No., Village, Taluka"
                      value={searchData.property_address}
                      onChange={(e) => setSearchData({...searchData, property_address: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="property-type">Property Type *</Label>
                    <Select onValueChange={(value) => setSearchData({...searchData, property_type: value})}>
                      <SelectTrigger id="property-type" data-testid="property-type-select">
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="agricultural_land">Agricultural Land</SelectItem>
                        <SelectItem value="residential_plot">Residential Plot</SelectItem>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="search-type">Search Type *</Label>
                    <Select onValueChange={(value) => setSearchData({...searchData, search_type: value})}>
                      <SelectTrigger id="search-type" data-testid="search-type-select">
                        <SelectValue placeholder="Select search type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="legal_verification">Legal Verification</SelectItem>
                        <SelectItem value="ownership">Ownership Check</SelectItem>
                        <SelectItem value="encumbrance">Encumbrance Certificate</SelectItem>
                        <SelectItem value="7_12_extract">7/12 Extract</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Select onValueChange={(value) => setSearchData({...searchData, state: value})}>
                      <SelectTrigger id="state" data-testid="state-select">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {indianStates.map(state => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="district">District</Label>
                    <Input
                      id="district"
                      data-testid="district-input"
                      placeholder="Enter district name"
                      value={searchData.district}
                      onChange={(e) => setSearchData({...searchData, district: e.target.value})}
                    />
                  </div>
                  <Button
                    onClick={handleLegalSearch}
                    data-testid="legal-search-button"
                    disabled={loading}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white py-6 rounded-xl font-semibold"
                  >
                    {loading ? 'Searching...' : 'Search Legal Records'}
                  </Button>
                </div>
              </Card>

              {result && result.results && (
                <Card className="p-6 rounded-2xl border-2 border-teal-100 bg-teal-50/50" data-testid="legal-result">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Legal Search Results</h3>
                  <div className="bg-white rounded-xl p-4">
                    <p className="text-slate-700 whitespace-pre-wrap">{result.results}</p>
                  </div>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="valuation">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="p-6 rounded-2xl border-2 border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Property Valuation</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="val-address">Property Address *</Label>
                    <Input
                      id="val-address"
                      data-testid="val-address-input"
                      placeholder="Full address"
                      value={valuationData.property_address}
                      onChange={(e) => setValuationData({...valuationData, property_address: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="val-type">Property Type *</Label>
                    <Select onValueChange={(value) => setValuationData({...valuationData, property_type: value})}>
                      <SelectTrigger id="val-type" data-testid="val-type-select">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="agricultural_land">Agricultural Land</SelectItem>
                        <SelectItem value="residential_plot">Residential Plot</SelectItem>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="area">Area (sq ft) *</Label>
                    <Input
                      id="area"
                      data-testid="area-input"
                      type="number"
                      placeholder="1000"
                      value={valuationData.area_sqft}
                      onChange={(e) => setValuationData({...valuationData, area_sqft: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="val-location">Location / Village *</Label>
                    <Input
                      id="val-location"
                      data-testid="val-location-input"
                      placeholder="Village, Taluka"
                      value={valuationData.location}
                      onChange={(e) => setValuationData({...valuationData, location: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="val-state">State *</Label>
                    <Select onValueChange={(value) => setValuationData({...valuationData, state: value})}>
                      <SelectTrigger id="val-state" data-testid="val-state-select">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {indianStates.map(state => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="age">Age of Property (years)</Label>
                    <Input
                      id="age"
                      data-testid="age-input"
                      type="number"
                      placeholder="5"
                      value={valuationData.age_of_property}
                      onChange={(e) => setValuationData({...valuationData, age_of_property: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="amenities">Amenities</Label>
                    <Input
                      id="amenities"
                      data-testid="amenities-input"
                      placeholder="e.g., Well, electricity, road access"
                      value={valuationData.amenities}
                      onChange={(e) => setValuationData({...valuationData, amenities: e.target.value})}
                    />
                  </div>
                  <Button
                    onClick={handleValuation}
                    data-testid="valuation-button"
                    disabled={loading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 rounded-xl font-semibold"
                  >
                    {loading ? 'Calculating...' : 'Get Valuation'}
                  </Button>
                </div>
              </Card>

              {result && result.estimated_value && (
                <Card className="p-6 rounded-2xl border-2 border-emerald-100 bg-emerald-50/50" data-testid="valuation-result">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Valuation Report</h3>
                  
                  <div className="mb-6 p-6 bg-white rounded-xl text-center">
                    <p className="text-sm text-slate-600 mb-2">Estimated Market Value</p>
                    <p className="text-4xl font-bold text-emerald-600">₹{result.estimated_value.toLocaleString('en-IN')}</p>
                  </div>

                  <div className="bg-white rounded-xl p-4">
                    <h4 className="font-semibold text-slate-900 mb-2">Detailed Analysis</h4>
                    <p className="text-slate-700 whitespace-pre-wrap text-sm">{result.valuation_details}</p>
                  </div>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Property;
