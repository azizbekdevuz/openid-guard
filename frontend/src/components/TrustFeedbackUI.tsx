'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle, XCircle, ChevronDown, ChevronUp, Fingerprint, RefreshCw } from 'lucide-react';
import { useTranslation } from 'next-i18next';

// Trust score result type
interface TrustScoreResult {
  score: number;
  riskLevel: 'low' | 'medium' | 'high' | string;
  labels: string[];
  factors?: Record<string, {
    score: number;
    weight: number;
    description: string;
  }>;
  sessionId?: string;
  timestamp?: string;
}

// Trust feedback props
interface TrustFeedbackUIProps {
  did: string;
  trustScore: TrustScoreResult;
  verifiedAt: string;
  className?: string;
  animated?: boolean;
  showDetails?: boolean;
}

export const TrustFeedbackUI: React.FC<TrustFeedbackUIProps> = ({
  did,
  trustScore,
  verifiedAt,
  className = '',
  animated = true,
  showDetails: initialShowDetails = false,
}) => {
  const [showDetails, setShowDetails] = useState(initialShowDetails);
  const [isAnimationComplete, setIsAnimationComplete] = useState(!animated);
  const { t } = useTranslation('common');

  // Start animation when component mounts
  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setIsAnimationComplete(true);
      }, 2000); // 2 seconds for animation to complete
      
      return () => clearTimeout(timer);
    }
  }, [animated]);

  // Format date string
  const formatDate = (dateString: string | undefined) => {
    if(!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (err) {
      console.log(err);
      return dateString;
    }
  };

  // Calculate color based on trust score
  const getScoreColor = (score: number) => {
    if (score >= 0.7) return 'bg-green-500';
    if (score >= 0.4) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  // Get text color based on trust score
  const getTextColor = (score: number) => {
    if (score >= 0.7) return 'text-green-400';
    if (score >= 0.4) return 'text-yellow-400';
    return 'text-red-400';
  };
  
  // Get risk level icon
  const getRiskIcon = (riskLevel: 'low' | 'medium' | 'high' | string) => {
    if (riskLevel === 'low') return <CheckCircle className="h-5 w-5 text-green-400" />;
    if (riskLevel === 'medium') return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
    return <XCircle className="h-5 w-5 text-red-400" />;
  };

  // Toggle details section
  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };
  
  return (
    <div className={`relative rounded-lg border border-gray-700 bg-gray-800/80 backdrop-blur-sm shadow-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 bg-gray-700/50 border-b border-gray-600/50 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="text-blue-400 h-5 w-5" />
          <h3 className="font-medium text-white">{t('verifier.digital_passport')}</h3>
        </div>
        <div className="flex items-center space-x-2 text-xs text-gray-300">
          <span>{formatDate(verifiedAt)}</span>
        </div>
      </div>
      
      {/* Trust Score Visualization */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-300">{t('verifier.trust_score')}</span>
          
          <AnimatePresence mode="wait">
            {isAnimationComplete ? (
              <motion.span
                key="final-score"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-sm font-bold ${getTextColor(trustScore.score)}`}
              >
                {Math.round(trustScore.score * 100)}%
              </motion.span>
            ) : (
              <motion.span
                key="calculating"
                className="text-xs text-gray-400 flex items-center"
              >
                <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                Calculating...
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        
        <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
          {animated ? (
            <motion.div 
              className={`h-2.5 rounded-full ${getScoreColor(trustScore.score)}`}
              initial={{ width: '5%' }}
              animate={{ width: `${trustScore.score * 100}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          ) : (
            <div 
              className={`h-2.5 rounded-full ${getScoreColor(trustScore.score)}`} 
              style={{ width: `${trustScore.score * 100}%` }}
            />
          )}
        </div>
        
        <div className="flex justify-between text-xs text-gray-500">
          <span>{t('verifier.high_risk')}</span>
          <span>{t('verifier.medium_risk')}</span>
          <span>{t('verifier.low_risk')}</span>
        </div>
      </div>
      
      {/* Risk Level */}
      <div className="px-4 py-2 border-t border-gray-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getRiskIcon(trustScore.riskLevel)}
            <span className="text-sm">{t('verifier.risk_level')}:</span>
            <span className={`text-sm font-medium ${getTextColor(trustScore.score)}`}>
              {trustScore.riskLevel.charAt(0).toUpperCase() + trustScore.riskLevel.slice(1)}
            </span>
          </div>
          
          <button
            onClick={toggleDetails}
            className="text-xs text-gray-400 hover:text-gray-300 flex items-center"
          >
            {showDetails ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                <span>Hide Details</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                <span>Show Details</span>
              </>
            )}
          </button>
        </div>
        
        {/* Trust Factors */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-3 pb-1">
                <h4 className="text-sm font-medium text-gray-300 mb-2">{t('verifier.trust_factors')}</h4>
                <div className="flex flex-wrap gap-2 mb-3">
                  {trustScore.labels.map((label, index) => {
                    // Determine label color based on label type
                    let bgColor = 'bg-blue-500/20 text-blue-300';
                    if (label.includes('verified')) bgColor = 'bg-green-500/20 text-green-300';
                    if (label.includes('suspicious') || label.includes('bot')) bgColor = 'bg-red-500/20 text-red-300';
                    if (label.includes('risk_low')) bgColor = 'bg-green-500/20 text-green-300';
                    if (label.includes('risk_medium')) bgColor = 'bg-yellow-500/20 text-yellow-300';
                    if (label.includes('risk_high')) bgColor = 'bg-red-500/20 text-red-300';

                    // Format label text
                    const formattedLabel = label
                      .replace(/_/g, ' ')
                      .replace(/\b\w/g, l => l.toUpperCase());

                    return (
                      <motion.span 
                        key={index} 
                        className={`px-2 py-1 rounded-full text-xs ${bgColor}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2, delay: index * 0.1 }}
                      >
                        {formattedLabel}
                      </motion.span>
                    );
                  })}
                </div>
                
                {/* Detailed Factors */}
                {trustScore.factors && (
                  <div className="space-y-2 mb-2 text-sm">
                    {Object.entries(trustScore.factors).map(([key, factor]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-gray-400">{factor.description}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-700 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full ${getScoreColor(factor.score)}`} 
                              style={{ width: `${factor.score * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-400">
                            {Math.round(factor.score * 100)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* DID Display */}
      <div className="px-4 py-3 border-t border-gray-700/50">
        <div className="flex items-center mb-1">
          <Fingerprint className="h-4 w-4 text-blue-400 mr-1.5" />
          <span className="text-sm font-medium text-gray-300">{t('verifier.decentralized_id')}</span>
        </div>
        <div className="flex">
          <code className="text-xs bg-gray-900 p-2 rounded border border-gray-700 font-mono overflow-x-auto w-full whitespace-nowrap">
            {did}
          </code>
        </div>
      </div>
    </div>
  );
};

export default TrustFeedbackUI;