"use client";

import React, { useState, useEffect } from 'react';

export default function SettingsScreen() {
  const [activeSection, setActiveSection] = useState<'profile' | 'security' | 'enterprise' | 'ai' | 'logs'>('profile');
  
  // Profile state
  const [displayName, setDisplayName] = useState('Chen Weiguo');
  const [department, setDepartment] = useState('医疗运营部');
  const [position, setPosition] = useState('运营总监');
  const [language, setLanguage] = useState('简体中文');

  // AI config state
  const [geminiKey, setGeminiKey] = useState('');
  const [mockMode, setMockMode] = useState(true);

  // Corporate state
  const [corpName, setCorpName] = useState('广州国际健康中心');
  const [businessLicense, setBusinessLicense] = useState('91440101MA59XXXXXX');
  const [medicalLicense, setMedicalLicense] = useState('PDY12847320XXXXXX');
  const [phone, setPhone] = useState('+86 20 8765 4321');
  const [currency, setCurrency] = useState('CNY');

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('vitacross_gemini_api_key') || '';
      const savedMock = localStorage.getItem('vitacross_mock_mode');
      
      setGeminiKey(savedKey);
      setMockMode(savedMock === null ? true : savedMock === 'true');

      const savedName = localStorage.getItem('vitacross_display_name');
      if (savedName) setDisplayName(savedName);
    }
  }, []);

  const handleSaveProfile = () => {
    localStorage.setItem('vitacross_display_name', displayName);
    alert('个人资料已保存');
  };

  const handleSaveAIConfig = () => {
    localStorage.setItem('vitacross_gemini_api_key', geminiKey);
    localStorage.setItem('vitacross_mock_mode', mockMode.toString());
    alert('AI 接口配置已保存');
  };

  const handleSaveCorp = () => {
    alert('企业信息已保存');
  };

  return (
    <div className="p-6 max-w-[1000px] mx-auto">
      <div className="bg-card border border-border-light shadow-sm rounded-xl overflow-hidden flex h-[620px]">
        {/* Settings Sidebar */}
        <div className="w-[220px] bg-bg-main border-r border-border-light p-4 flex flex-col gap-1">
          <div className="text-xs font-bold text-text-muted mb-2 px-3 uppercase tracking-wider">系统设置</div>
          <button 
            onClick={() => setActiveSection('profile')}
            className={`text-left px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeSection === 'profile' ? 'bg-primary text-white shadow-sm' : 'text-text-muted hover:bg-white hover:text-text-main'}`}
          >
            个人资料
          </button>
          <button 
            onClick={() => setActiveSection('security')}
            className={`text-left px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeSection === 'security' ? 'bg-primary text-white shadow-sm' : 'text-text-muted hover:bg-white hover:text-text-main'}`}
          >
            账号与安全
          </button>
          <button 
            onClick={() => setActiveSection('enterprise')}
            className={`text-left px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeSection === 'enterprise' ? 'bg-primary text-white shadow-sm' : 'text-text-muted hover:bg-white hover:text-text-main'}`}
          >
            企业信息
          </button>
          
          <div className="text-xs font-bold text-text-muted mt-4 mb-2 px-3 uppercase tracking-wider">高级配置</div>
          <button 
            onClick={() => setActiveSection('ai')}
            className={`text-left px-3 py-2 text-sm font-medium rounded-md transition-colors flex justify-between items-center ${activeSection === 'ai' ? 'bg-primary text-white shadow-sm' : 'text-text-muted hover:bg-white hover:text-text-main'}`}
          >
            AI 接口配置 <span className="w-2 h-2 rounded-full bg-danger animate-pulse"></span>
          </button>
          <button 
            onClick={() => setActiveSection('logs')}
            className={`text-left px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeSection === 'logs' ? 'bg-primary text-white shadow-sm' : 'text-text-muted hover:bg-white hover:text-text-main'}`}
          >
            系统日志
          </button>
        </div>

        {/* Settings Content Area */}
        <div className="flex-1 p-8 overflow-y-auto bg-white">
          
          {/* PROFILE SECTION */}
          {activeSection === 'profile' && (
            <div>
              <div className="mb-6 pb-4 border-b border-border-light">
                <h2 className="text-xl font-bold text-text-main flex items-center gap-2">👤 个人资料</h2>
                <p className="text-sm text-text-muted mt-1">管理您在 VitaCross 平台的企业名片与个人基本配置</p>
              </div>

              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-info flex items-center justify-center text-2xl font-bold text-white shadow-md border-4 border-white">
                  {displayName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <button className="btn btn-ghost !py-1.5 !px-3 font-medium border border-border-light text-xs">更换头像</button>
                  <p className="text-xs text-text-muted mt-2 max-w-[200px]">支持 JPG, PNG 格式。最大文件大小 5MB。</p>
                </div>
              </div>

              <div className="max-w-[500px] flex flex-col gap-5">
                <div>
                  <label className="block text-sm font-semibold text-text-main mb-1.5">显示名称</label>
                  <input 
                    type="text" 
                    value={displayName} 
                    onChange={(e) => setDisplayName(e.target.value)} 
                    className="w-full px-3 py-2 border border-border-dark rounded-md text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-medium text-text-main" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-text-main mb-1.5">登录邮箱 / 账号</label>
                  <input 
                    type="email" 
                    defaultValue="chen.weiguo@vitacross.com" 
                    disabled 
                    className="w-full px-3 py-2 border border-border-light bg-bg-main rounded-md text-sm outline-none text-text-muted cursor-not-allowed" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-text-main mb-1.5">部门</label>
                    <input 
                      type="text" 
                      value={department} 
                      onChange={(e) => setDepartment(e.target.value)} 
                      className="w-full px-3 py-2 border border-border-dark rounded-md text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-medium text-text-main" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-main mb-1.5">职位</label>
                    <input 
                      type="text" 
                      value={position} 
                      onChange={(e) => setPosition(e.target.value)} 
                      className="w-full px-3 py-2 border border-border-dark rounded-md text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-medium text-text-main" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-main mb-1.5">系统偏好语言</label>
                  <select 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value)} 
                    className="w-full px-3 py-2 border border-border-dark rounded-md text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-medium text-text-main bg-white"
                  >
                    <option>简体中文</option>
                    <option>English</option>
                  </select>
                </div>
                
                <div className="mt-4 pt-5 border-t border-border-light flex gap-3">
                  <button onClick={handleSaveProfile} className="btn btn-primary">保存设置</button>
                </div>
              </div>
            </div>
          )}

          {/* SECURITY SECTION */}
          {activeSection === 'security' && (
            <div>
              <div className="mb-6 pb-4 border-b border-border-light">
                <h2 className="text-xl font-bold text-text-main flex items-center gap-2">🔑 账号与安全</h2>
                <p className="text-sm text-text-muted mt-1">管理密码、两步验证与平台登录凭证</p>
              </div>
              <div className="max-w-[500px] flex flex-col gap-6">
                <div className="flex items-center justify-between p-4 bg-bg-main rounded-lg border border-border-light">
                  <div>
                    <div className="text-sm font-bold text-text-main">账户密码</div>
                    <div className="text-xs text-text-muted mt-1">上次修改于 30 天前</div>
                  </div>
                  <button className="btn btn-ghost border border-border-light text-xs font-semibold !py-1.5 !px-3">修改密码</button>
                </div>

                <div className="flex items-center justify-between p-4 bg-bg-main rounded-lg border border-border-light">
                  <div>
                    <div className="text-sm font-bold text-text-main">双重身份验证 (2FA)</div>
                    <div className="text-xs text-text-muted mt-1">未开启，建议开启以保障账户安全</div>
                  </div>
                  <button className="btn btn-primary text-xs font-semibold !py-1.5 !px-3">启用</button>
                </div>
              </div>
            </div>
          )}

          {/* ENTERPRISE SECTION */}
          {activeSection === 'enterprise' && (
            <div>
              <div className="mb-6 pb-4 border-b border-border-light">
                <h2 className="text-xl font-bold text-text-main flex items-center gap-2">🏢 企业信息</h2>
                <p className="text-sm text-text-muted mt-1">管理医疗机构或保司接入基本证照与机构基本信息</p>
              </div>

              <div className="max-w-[500px] flex flex-col gap-5">
                <div>
                  <label className="block text-sm font-semibold text-text-main mb-1.5">机构/企业全称</label>
                  <input 
                    type="text" 
                    value={corpName} 
                    onChange={(e) => setCorpName(e.target.value)} 
                    className="w-full px-3 py-2 border border-border-dark rounded-md text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-medium text-text-main" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-text-main mb-1.5">统一社会信用代码</label>
                    <input 
                      type="text" 
                      value={businessLicense} 
                      onChange={(e) => setBusinessLicense(e.target.value)} 
                      className="w-full px-3 py-2 border border-border-dark rounded-md text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-medium text-text-main" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-main mb-1.5">医疗机构执业许可证号</label>
                    <input 
                      type="text" 
                      value={medicalLicense} 
                      onChange={(e) => setMedicalLicense(e.target.value)} 
                      className="w-full px-3 py-2 border border-border-dark rounded-md text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-medium text-text-main" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-text-main mb-1.5">联系电话</label>
                    <input 
                      type="text" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                      className="w-full px-3 py-2 border border-border-dark rounded-md text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-medium text-text-main" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-main mb-1.5">常用结算币种</label>
                    <select 
                      value={currency} 
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full px-3 py-2 border border-border-dark rounded-md text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-medium text-text-main bg-white"
                    >
                      <option value="CNY">人民币 (CNY)</option>
                      <option value="USD">美元 (USD)</option>
                      <option value="JPY">日元 (JPY)</option>
                      <option value="EUR">欧元 (EUR)</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4 pt-5 border-t border-border-light">
                  <button onClick={handleSaveCorp} className="btn btn-primary">保存企业资料</button>
                </div>
              </div>
            </div>
          )}

          {/* AI CONFIG SECTION */}
          {activeSection === 'ai' && (
            <div>
              <div className="mb-6 pb-4 border-b border-border-light">
                <h2 className="text-xl font-bold text-text-main flex items-center gap-2">🤖 VitaCross 多模态 OCR · AI 接口配置</h2>
                <p className="text-sm text-text-muted mt-1">管理和接入 Google Gemini 多模态大模型及演示数据开关</p>
              </div>

              <div className="max-w-[500px] flex flex-col gap-6">
                <div>
                  <label className="block text-sm font-semibold text-text-main mb-2">Google Gemini API Key</label>
                  <input 
                    type="password" 
                    placeholder="请输入以 AIzaSy 开头的 API Key"
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                    className="w-full px-3 py-2 border border-border-dark rounded-md text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 font-mono"
                  />
                  <p className="text-[11px] text-text-muted mt-1">用于病历多模态 OCR 识别与 ICD 自动编码映射，仅保留在本地浏览器环境或项目部署的后台环境变量中。</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-main mb-3">运行模式配置</label>
                  <div className="flex items-center justify-between p-4 bg-bg-main rounded-lg border border-border-light">
                    <div>
                      <div className="text-xs font-bold text-text-main">演示模式 (Mock Data)</div>
                      <div className="text-[11px] text-text-muted mt-1">开启后将使用内置高保真医疗数据演示，无需消耗 API 额度。</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={mockMode} 
                        onChange={(e) => setMockMode(e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-success"></div>
                    </label>
                  </div>

                  <div className="mt-3">
                    {mockMode ? (
                      <span className="inline-block py-1.5 px-3 rounded-full text-xs font-semibold bg-success/10 text-success border border-success/20">
                        演示模式已开启 — 使用内置高保真数据，无需 API Key
                      </span>
                    ) : (
                      <span className="inline-block py-1.5 px-3 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                        实时模式 — 使用 Gemini API 进行真实 OCR 解析
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-blue-50/50 border border-primary/10 rounded-lg">
                  <h4 className="text-xs font-bold text-primary mb-1">已适配的模型型号</h4>
                  <p className="text-[11px] text-text-muted leading-relaxed">
                    当前采用 <strong>Gemini 2.5 Flash</strong> 多模态模型。该模型擅长多模态中英文病历与票据图像解析、ICD-10 Terminology 复杂推理映射，具备极快的推理时效。
                  </p>
                </div>

                <div className="mt-2 pt-4 border-t border-border-light">
                  <button onClick={handleSaveAIConfig} className="btn btn-primary">保存 AI 配置</button>
                </div>
              </div>
            </div>
          )}

          {/* LOGS SECTION */}
          {activeSection === 'logs' && (
            <div>
              <div className="mb-6 pb-4 border-b border-border-light">
                <h2 className="text-xl font-bold text-text-main flex items-center gap-2">📑 系统日志</h2>
                <p className="text-sm text-text-muted mt-1">查看 VitaCross OCR 解析请求及跨境结算管道运行日志</p>
              </div>
              
              <div className="bg-bg-main p-4 rounded-lg border border-border-light font-mono text-[10px] text-text-muted flex flex-col gap-2 h-[420px] overflow-y-auto">
                <div>[2026-06-12 12:00:05] [INFO] [System] VitaCross Backend initialization complete. database synced.</div>
                <div>[2026-06-12 12:00:10] [INFO] [RAG] Policy vector library initialized. loaded 42 insurer guidelines.</div>
                <div>[2026-06-12 12:01:29] [INFO] [OCR] OCR service registered. Adapter model: Gemini 2.5 Flash.</div>
                <div>[2026-06-12 12:02:54] [INFO] [Settlement] Currency CIPS exchange route active. USD/JPY/CNY channels open.</div>
                <div className="text-primary font-semibold">[2026-06-12 12:05:26] [DEBUG] [Demo] Mock response pipeline executed. successfully parsed patient "David Kim" medical receipt.</div>
                <div className="text-success font-semibold">[2026-06-12 12:05:27] [INFO] [Settlement] Auto-settled claim MR-2026-98124. Currency: CNY. Amount: ¥32,600.00. Status: AUTO_SETTLED.</div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
