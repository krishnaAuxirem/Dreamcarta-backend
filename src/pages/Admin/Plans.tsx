import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { CreatePlanPayload, PlanItem, createPlanApi, getAdminPlansApi, updatePlanApi } from '@/lib/api/adminApi';
import getApiErrorMessage from '@/lib/api/getApiErrorMessage';

const defaultForm: CreatePlanPayload = {
  name: '',
  price: 0,
  period: 'month',
  description: '',
  features: [],
  highlighted: false,
  badge: '',
  isEnabled: true,
};

export default function AdminPlans() {
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [togglingById, setTogglingById] = useState<Record<string, boolean>>({});
  const [form, setForm] = useState<CreatePlanPayload>(defaultForm);
  const [featureInput, setFeatureInput] = useState('');

  useEffect(() => {
    const loadPlans = async () => {
      setLoading(true);
      try {
        const data = await getAdminPlansApi();
        setPlans(data);
      } catch (error) {
        toast.error(getApiErrorMessage(error, 'Failed to load plans'));
      } finally {
        setLoading(false);
      }
    };

    void loadPlans();
  }, []);

  const addFeature = () => {
    const value = featureInput.trim();
    if (!value) {
      toast.error('Feature text cannot be empty');
      return;
    }
    setForm((previous) => ({ ...previous, features: [...previous.features, value] }));
    setFeatureInput('');
  };

  const handleCreatePlan = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim()) {
      toast.error('Plan name required');
      return;
    }

    if (form.price < 0) {
      toast.error('Price cannot be negative');
      return;
    }

    setCreating(true);
    try {
      const created = await createPlanApi({
        ...form,
        name: form.name.trim(),
        description: form.description.trim(),
      });
      setPlans((previous) => [created, ...previous]);
      setForm(defaultForm);
      setFeatureInput('');
      toast.success('Plan created');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to create plan'));
    } finally {
      setCreating(false);
    }
  };

  const handleToggleEnabled = async (plan: PlanItem) => {
    setTogglingById((previous) => ({ ...previous, [plan.id]: true }));
    try {
      const updated = await updatePlanApi(plan.id, { isEnabled: !plan.isEnabled });
      setPlans((previous) => previous.map((item) => (item.id === plan.id ? updated : item)));
      toast.success(updated.isEnabled ? 'Plan enabled' : 'Plan disabled');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to update plan'));
    } finally {
      setTogglingById((previous) => ({ ...previous, [plan.id]: false }));
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-2xl font-bold">Subscription Plans</h2>
        <p className="text-sm text-muted-foreground mt-1">Create and manage pricing plans.</p>
      </div>

      <form onSubmit={handleCreatePlan} className="rounded-xl border border-border bg-card p-4 space-y-3">
        <div className="grid sm:grid-cols-2 gap-3">
          <input
            value={form.name}
            onChange={(event) => setForm((previous) => ({ ...previous, name: event.target.value }))}
            placeholder="Plan name"
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
          <input
            type="number"
            value={form.price}
            onChange={(event) => setForm((previous) => ({ ...previous, price: Number(event.target.value || 0) }))}
            placeholder="Price"
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
        </div>

        <textarea
          value={form.description}
          onChange={(event) => setForm((previous) => ({ ...previous, description: event.target.value }))}
          placeholder="Plan description"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />

        <div className="flex gap-2">
          <input
            value={featureInput}
            onChange={(event) => setFeatureInput(event.target.value)}
            placeholder="Add feature"
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
          <button type="button" onClick={addFeature} disabled={creating} className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted disabled:opacity-60">
            Add
          </button>
        </div>

        {form.features.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {form.features.map((feature) => (
              <span key={feature} className="rounded-full bg-primary/10 text-primary text-xs px-2.5 py-1">
                {feature}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 text-sm">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={Boolean(form.highlighted)}
              onChange={(event) => setForm((previous) => ({ ...previous, highlighted: event.target.checked }))}
            />
            Highlight plan
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={Boolean(form.isEnabled)}
              onChange={(event) => setForm((previous) => ({ ...previous, isEnabled: event.target.checked }))}
            />
            Enabled
          </label>
        </div>

        <button type="submit" disabled={creating} className="rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:bg-primary/90 disabled:opacity-60">
          {creating ? 'Creating...' : 'Create Plan'}
        </button>
      </form>

      <div className="rounded-xl border border-border bg-card p-4">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading plans...</p>
        ) : plans.length === 0 ? (
          <p className="text-sm text-muted-foreground">No plans available.</p>
        ) : (
          <div className="space-y-3">
            {plans.map((plan) => (
              <div key={plan.id} className="rounded-lg border border-border p-3 flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-sm">{plan.name}</p>
                  <p className="text-xs text-muted-foreground">Rs. {plan.price}/{plan.period} • {plan.isEnabled ? 'Enabled' : 'Disabled'}</p>
                </div>
                <button
                  type="button"
                  disabled={Boolean(togglingById[plan.id])}
                  onClick={() => void handleToggleEnabled(plan)}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-muted disabled:opacity-60"
                >
                  {togglingById[plan.id] ? 'Processing...' : plan.isEnabled ? 'Disable' : 'Enable'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
