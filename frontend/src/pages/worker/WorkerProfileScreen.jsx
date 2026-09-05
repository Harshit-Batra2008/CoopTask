import { useEffect, useState } from "react";
import AppShell from "../../components/layout/AppShell.jsx";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import TextField from "../../components/ui/TextField.jsx";
import Select from "../../components/ui/Select.jsx";
import StatusBadge from "../../components/ui/StatusBadge.jsx";
import { apiFetch } from "../../utils/api.js";
import { verificationBadge } from "../../utils/verificationBadge.js";

const NAV_ITEMS = [
  { to: "/worker", label: "Home", icon: "🏠" },
  { to: "/worker/jobs", label: "Jobs", icon: "🧰" },
  { to: "/worker/availability", label: "Availability", icon: "🗓️" },
  { to: "/worker/profile", label: "Profile", icon: "👤" },
];

const TABS = ["Profile", "Skills", "Certifications"];

export default function WorkerProfileScreen() {
  const [activeTab, setActiveTab] = useState("Profile");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [services, setServices] = useState([]);

  // Profile form state
  const [bio, setBio] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [profileSaved, setProfileSaved] = useState(false);

  // Add-skill form state
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillYears, setNewSkillYears] = useState("");
  const [addingSkill, setAddingSkill] = useState(false);
  const [skillError, setSkillError] = useState(null);

  // Add-certification form state
  const [certName, setCertName] = useState("");
  const [certOrg, setCertOrg] = useState("");
  const [addingCert, setAddingCert] = useState(false);
  const [certError, setCertError] = useState(null);

  async function loadAll() {
    setLoading(true);
    setError(null);
    try {
      const [meData, servicesData] = await Promise.all([
        apiFetch("/api/workers/me"),
        apiFetch("/api/services"),
      ]);
      setProfile(meData.profile);
      setSkills(meData.skills);
      setCertifications(meData.certifications);
      setServices(servicesData.services);
      setBio(meData.profile.bio || "");
      setExperienceYears(
        meData.profile.experienceYears === null ? "" : String(meData.profile.experienceYears)
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function handleSaveProfile(e) {
    e.preventDefault();
    setProfileError(null);
    setProfileSaved(false);
    setSavingProfile(true);
    try {
      const body = {
        bio: bio.trim() === "" ? null : bio.trim(),
        experienceYears: experienceYears === "" ? null : Number(experienceYears),
      };
      const data = await apiFetch("/api/workers/me", { method: "PUT", body: JSON.stringify(body) });
      setProfile(data.profile);
      setProfileSaved(true);
    } catch (err) {
      setProfileError(err.message);
    } finally {
      setSavingProfile(false);
    }
  }

  const availableServiceOptions = services
    .filter((s) => !skills.some((skill) => skill.skillName.toLowerCase() === s.name.toLowerCase()))
    .map((s) => ({ value: s.name, label: s.name }));

  async function handleAddSkill(e) {
    e.preventDefault();
    setSkillError(null);
    if (!newSkillName) {
      setSkillError("Choose a skill from the list.");
      return;
    }
    setAddingSkill(true);
    try {
      const body = {
        skillName: newSkillName,
        experienceYears: newSkillYears === "" ? null : Number(newSkillYears),
      };
      const data = await apiFetch("/api/workers/me/skills", { method: "POST", body: JSON.stringify(body) });
      setSkills((prev) => [...prev, data.skill]);
      setNewSkillName("");
      setNewSkillYears("");
    } catch (err) {
      setSkillError(err.message);
    } finally {
      setAddingSkill(false);
    }
  }

  async function handleRemoveSkill(skillId) {
    try {
      await apiFetch(`/api/workers/me/skills/${skillId}`, { method: "DELETE" });
      setSkills((prev) => prev.filter((s) => s.id !== skillId));
    } catch (err) {
      setSkillError(err.message);
    }
  }

  async function handleAddCertification(e) {
    e.preventDefault();
    setCertError(null);
    setAddingCert(true);
    try {
      const data = await apiFetch("/api/workers/me/certifications", {
        method: "POST",
        body: JSON.stringify({ name: certName, issuingOrganization: certOrg }),
      });
      setCertifications((prev) => [...prev, data.certification]);
      setCertName("");
      setCertOrg("");
    } catch (err) {
      setCertError(err.message);
    } finally {
      setAddingCert(false);
    }
  }

  async function handleRemoveCertification(certificationId) {
    try {
      await apiFetch(`/api/workers/me/certifications/${certificationId}`, { method: "DELETE" });
      setCertifications((prev) => prev.filter((c) => c.id !== certificationId));
    } catch (err) {
      setCertError(err.message);
    }
  }

  if (loading) {
    return (
      <AppShell roleLabel="Worker" navItems={NAV_ITEMS}>
        <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-sm)" }}>Loading profile…</p>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell roleLabel="Worker" navItems={NAV_ITEMS}>
        <Card style={{ borderColor: "var(--color-danger)" }}>
          <p style={{ color: "var(--color-danger)", fontSize: "var(--font-size-sm)" }}>
            Couldn't load your profile: {error}
          </p>
        </Card>
      </AppShell>
    );
  }

  const badge = verificationBadge(profile.verificationStatus);

  return (
    <AppShell roleLabel="Worker" navItems={NAV_ITEMS}>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: "var(--font-size-lg)" }}>{profile.name}</h1>
            <p style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-muted)" }}>
              {profile.email}
            </p>
          </div>
          <StatusBadge label={badge.label} tone={badge.tone} />
        </div>
      </Card>

      <div style={{ display: "flex", gap: "var(--space-2)" }}>
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: "var(--space-2)",
              borderRadius: "var(--radius-sm)",
              border: activeTab === tab ? "2px solid var(--color-primary)" : "1px solid var(--color-border)",
              background: activeTab === tab ? "var(--color-primary-soft)" : "var(--color-surface)",
              fontSize: "var(--font-size-sm)",
              fontWeight: activeTab === tab ? "var(--font-weight-medium)" : "var(--font-weight-regular)",
              minHeight: "var(--touch-target-min)",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Profile" && (
        <Card>
          <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            <label style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
              <span style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-muted)" }}>Bio</span>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Tell customers a bit about yourself"
                style={{
                  padding: "var(--space-3)",
                  fontSize: "var(--font-size-md)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-sm)",
                  fontFamily: "inherit",
                  resize: "vertical",
                }}
              />
            </label>
            <TextField
              label="Years of experience"
              type="number"
              value={experienceYears}
              onChange={(e) => setExperienceYears(e.target.value)}
              placeholder="e.g. 3"
            />

            {profileError && (
              <p style={{ color: "var(--color-danger)", fontSize: "var(--font-size-sm)" }}>{profileError}</p>
            )}
            {profileSaved && !profileError && (
              <p style={{ color: "var(--color-success)", fontSize: "var(--font-size-sm)" }}>Profile saved.</p>
            )}

            <Button type="submit" variant="primary" fullWidth disabled={savingProfile}>
              {savingProfile ? "Saving…" : "Save profile"}
            </Button>
          </form>
        </Card>
      )}

      {activeTab === "Skills" && (
        <>
          <Card>
            <h2 style={{ fontSize: "var(--font-size-md)", marginBottom: "var(--space-2)" }}>Add a skill</h2>
            <form onSubmit={handleAddSkill} style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              <Select
                label="Service"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                options={availableServiceOptions}
                placeholder={
                  availableServiceOptions.length === 0 ? "No more services to add" : "Choose a service"
                }
              />
              <TextField
                label="Years of experience (optional)"
                type="number"
                value={newSkillYears}
                onChange={(e) => setNewSkillYears(e.target.value)}
                placeholder="e.g. 2"
              />
              {skillError && (
                <p style={{ color: "var(--color-danger)", fontSize: "var(--font-size-sm)" }}>{skillError}</p>
              )}
              <Button type="submit" variant="primary" fullWidth disabled={addingSkill || availableServiceOptions.length === 0}>
                {addingSkill ? "Adding…" : "Add skill"}
              </Button>
            </form>
          </Card>

          {skills.length === 0 ? (
            <Card>
              <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-sm)" }}>
                You haven't added any skills yet.
              </p>
            </Card>
          ) : (
            skills.map((skill) => (
              <Card key={skill.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontWeight: "var(--font-weight-medium)" }}>{skill.skillName}</p>
                    {skill.experienceYears !== null && (
                      <p style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-muted)" }}>
                        {skill.experienceYears} yrs experience
                      </p>
                    )}
                  </div>
                  <Button variant="secondary" onClick={() => handleRemoveSkill(skill.id)}>
                    Remove
                  </Button>
                </div>
              </Card>
            ))
          )}
        </>
      )}

      {activeTab === "Certifications" && (
        <>
          <Card>
            <h2 style={{ fontSize: "var(--font-size-md)", marginBottom: "var(--space-2)" }}>
              Add a certification
            </h2>
            <form
              onSubmit={handleAddCertification}
              style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}
            >
              <TextField
                label="Certification name"
                value={certName}
                onChange={(e) => setCertName(e.target.value)}
                placeholder="e.g. Certified Electrician"
              />
              <TextField
                label="Issuing organization"
                value={certOrg}
                onChange={(e) => setCertOrg(e.target.value)}
                placeholder="e.g. State Skill Development Board"
              />
              {certError && (
                <p style={{ color: "var(--color-danger)", fontSize: "var(--font-size-sm)" }}>{certError}</p>
              )}
              <Button type="submit" variant="primary" fullWidth disabled={addingCert}>
                {addingCert ? "Adding…" : "Add certification"}
              </Button>
            </form>
          </Card>

          {certifications.length === 0 ? (
            <Card>
              <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-sm)" }}>
                No certifications added yet.
              </p>
            </Card>
          ) : (
            certifications.map((cert) => (
              <Card key={cert.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontWeight: "var(--font-weight-medium)" }}>{cert.name}</p>
                    <p style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-muted)" }}>
                      {cert.issuingOrganization}
                    </p>
                  </div>
                  <Button variant="secondary" onClick={() => handleRemoveCertification(cert.id)}>
                    Remove
                  </Button>
                </div>
              </Card>
            ))
          )}
        </>
      )}
    </AppShell>
  );
}
