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
          <TabsList className="grid grid-cols-3 w-full max-w-2xl">
            <TabsTrigger value="legal" data-testid="tab-legal">Legal Search</TabsTrigger>
            <TabsTrigger value="land-records" data-testid="tab-land-records">Land Records</TabsTrigger>
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

          {/* Land Records */}
          <TabsContent value="land-records">
            <div className="space-y-6">
              {/* Info Card */}
              <Card className="p-6 rounded-2xl border-2 border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Access State Land Records Online</h2>
                    <p className="text-slate-600 text-sm mb-3">
                      Check your property records directly from official state government portals. Search using Dag, Khatiyan, Plot number, or other land identifiers.
                    </p>
                    <p className="text-xs text-slate-500">
                      সরাসরি সরকারি পোর্টাল থেকে আপনার জমির রেকর্ড দেখুন / सीधे सरकारी पोर्टल से अपनी जमीन का रिकॉर्ड देखें
                    </p>
                  </div>
                </div>
              </Card>

              {/* State Portals Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* West Bengal - Banglarbhumi */}
                <Card className="p-6 rounded-2xl border-2 border-slate-100 hover:border-emerald-300 hover:shadow-lg transition-all">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-sm">WB</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">West Bengal</h3>
                      <p className="text-xs text-slate-500">Banglarbhumi</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">
                    Search using Dag, Khatiyan, Plot number / দাগ, খতিয়ান, প্লট নম্বর
                  </p>
                  <div className="bg-slate-50 rounded-lg p-3 mb-4">
                    <p className="text-xs text-slate-600 mb-2 font-medium">Required Information:</p>
                    <ul className="text-xs text-slate-600 space-y-1">
                      <li>• District / জেলা</li>
                      <li>• Block / ব্লক</li>
                      <li>• Mouza / মৌজা</li>
                      <li>• Dag No. / দাগ নম্বর</li>
                      <li>• Khatiyan No. / খতিয়ান নম্বর</li>
                    </ul>
                  </div>
                  <Button
                    onClick={() => window.open('https://banglarbhumi.gov.in/BanglarBhumi/Home.action', '_blank')}
                    data-testid="banglarbhumi-button"
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-xl"
                  >
                    Access Banglarbhumi
                  </Button>
                </Card>

                {/* Uttar Pradesh - Bhulekh */}
                <Card className="p-6 rounded-2xl border-2 border-slate-100 hover:border-emerald-300 hover:shadow-lg transition-all">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-sm">UP</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Uttar Pradesh</h3>
                      <p className="text-xs text-slate-500">Bhulekh UP</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">
                    Khasra, Khatoni, Bhulekh Nakal / खसरा, खतौनी
                  </p>
                  <div className="bg-slate-50 rounded-lg p-3 mb-4">
                    <p className="text-xs text-slate-600 mb-2 font-medium">Required Information:</p>
                    <ul className="text-xs text-slate-600 space-y-1">
                      <li>• District / जिला</li>
                      <li>• Tehsil / तहसील</li>
                      <li>• Village / गांव</li>
                      <li>• Khasra No. / खसरा नंबर</li>
                      <li>• Khatauni No. / खतौनी नंबर</li>
                    </ul>
                  </div>
                  <Button
                    onClick={() => window.open('https://upbhulekh.gov.in/', '_blank')}
                    data-testid="bhulekh-button"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                  >
                    Access Bhulekh UP
                  </Button>
                </Card>

                {/* Maharashtra - Mahabhulekh */}
                <Card className="p-6 rounded-2xl border-2 border-slate-100 hover:border-emerald-300 hover:shadow-lg transition-all">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-sm">MH</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Maharashtra</h3>
                      <p className="text-xs text-slate-500">Mahabhulekh</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">
                    7/12 Utara, 8A, Property Card / सात-बारा उतारा
                  </p>
                  <div className="bg-slate-50 rounded-lg p-3 mb-4">
                    <p className="text-xs text-slate-600 mb-2 font-medium">Required Information:</p>
                    <ul className="text-xs text-slate-600 space-y-1">
                      <li>• District / जिल्हा</li>
                      <li>• Taluka / तालुका</li>
                      <li>• Village / गाव</li>
                      <li>• Survey No. / सर्वे नंबर</li>
                      <li>• Hissa No. / हिस्सा नंबर</li>
                    </ul>
                  </div>
                  <Button
                    onClick={() => window.open('https://mahabhulekh.maharashtra.gov.in/', '_blank')}
                    data-testid="mahabhulekh-button"
                    className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl"
                  >
                    Access Mahabhulekh
                  </Button>
                </Card>

                {/* Karnataka - Bhoomi */}
                <Card className="p-6 rounded-2xl border-2 border-slate-100 hover:border-emerald-300 hover:shadow-lg transition-all">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-sm">KA</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Karnataka</h3>
                      <p className="text-xs text-slate-500">Bhoomi RTC</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">
                    RTC, Mutation records / ಆರ್‌ಟಿಸಿ, ಮ್ಯೂಟೇಶನ್
                  </p>
                  <div className="bg-slate-50 rounded-lg p-3 mb-4">
                    <p className="text-xs text-slate-600 mb-2 font-medium">Required Information:</p>
                    <ul className="text-xs text-slate-600 space-y-1">
                      <li>• District</li>
                      <li>• Taluk</li>
                      <li>• Hobli</li>
                      <li>• Village</li>
                      <li>• Survey No.</li>
                    </ul>
                  </div>
                  <Button
                    onClick={() => window.open('https://landrecords.karnataka.gov.in/service2/', '_blank')}
                    data-testid="bhoomi-button"
                    className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl"
                  >
                    Access Bhoomi
                  </Button>
                </Card>

                {/* Tamil Nadu - Patta Chitta */}
                <Card className="p-6 rounded-2xl border-2 border-slate-100 hover:border-emerald-300 hover:shadow-lg transition-all">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-sm">TN</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Tamil Nadu</h3>
                      <p className="text-xs text-slate-500">TNESEVAI</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">
                    Patta, Chitta, FMB / பட்டா, சிட்டா
                  </p>
                  <div className="bg-slate-50 rounded-lg p-3 mb-4">
                    <p className="text-xs text-slate-600 mb-2 font-medium">Required Information:</p>
                    <ul className="text-xs text-slate-600 space-y-1">
                      <li>• District</li>
                      <li>• Taluk</li>
                      <li>• Village</li>
                      <li>• Survey No.</li>
                      <li>• Subdivision No.</li>
                    </ul>
                  </div>
                  <Button
                    onClick={() => window.open('https://eservices.tn.gov.in/eservicesnew/land/tamilNilam_en.html', '_blank')}
                    data-testid="tnland-button"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl"
                  >
                    Access TN Land Records
                  </Button>
                </Card>

                {/* All States Portal */}
                <Card className="p-6 rounded-2xl border-2 border-slate-100 hover:border-emerald-300 hover:shadow-lg transition-all">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-sm">All</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">All States</h3>
                      <p className="text-xs text-slate-500">National Portal</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">
                    Access land records of any state in India
                  </p>
                  <div className="bg-slate-50 rounded-lg p-3 mb-4">
                    <p className="text-xs text-slate-600 mb-2 font-medium">Available for:</p>
                    <ul className="text-xs text-slate-600 space-y-1">
                      <li>• All 28 States</li>
                      <li>• Union Territories</li>
                      <li>• Unified Portal</li>
                      <li>• Multiple Languages</li>
                      <li>• Official Records</li>
                    </ul>
                  </div>
                  <Button
                    onClick={() => window.open('https://landrecords.india.gov.in/', '_blank')}
                    data-testid="national-land-button"
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-xl"
                  >
                    Access National Portal
                  </Button>
                </Card>
              </div>

              {/* Help Section */}
              <Card className="p-6 rounded-2xl border-2 border-slate-100 bg-slate-50">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Need Help Understanding Land Records?</h3>
                    <p className="text-sm text-slate-600 mb-3">
                      Not sure what Dag, Khatiyan, or Survey numbers mean? Our AI advisor can help you understand these terms 
                      and guide you step-by-step on how to search your land records.
                    </p>
                    <div className="flex items-center space-x-3">
                      <Button
                        onClick={() => window.location.href = '/ai-advisor'}
                        className="bg-violet-600 hover:bg-violet-700 text-white"
                      >
                        Ask AI Advisor
                      </Button>
                      <span className="text-xs text-slate-500">
                        হিন্দিতে, বাংলায় বা ইংরেজিতে প্রশ্ন করুন / हिंदी में पूछें
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
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
